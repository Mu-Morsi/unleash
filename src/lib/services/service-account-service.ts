/**
 * INGKA Fork: Service Account Service
 * Provides CRUD operations for service accounts that were previously enterprise-only.
 * Service accounts are stored in the users table with is_service = true.
 */

import type { Logger } from '../logger.js';
import type { IUnleashConfig, IAuditUser, IUnleashStores } from '../types/index.js';
import type {
    IServiceAccount,
    ICreateServiceAccount,
    IUpdateServiceAccount,
} from '../types/model.js';
import {
    SERVICE_ACCOUNT_CREATED,
    SERVICE_ACCOUNT_UPDATED,
    SERVICE_ACCOUNT_DELETED,
} from '../events/index.js';
import type EventService from '../features/events/event-service.js';
import type { AccessService } from './access-service.js';
import type PatService from './pat-service.js';
import type { IUserStore } from '../types/stores/user-store.js';
import BadDataError from '../error/bad-data-error.js';
import NotFoundError from '../error/notfound-error.js';
import NameExistsError from '../error/name-exists-error.js';
import type { IRole } from '../types/stores/access-store.js';
import type { PatSchema } from '../openapi/index.js';

export class ServiceAccountService {
    private config: IUnleashConfig;
    private logger: Logger;
    private userStore: IUserStore;
    private accessService: AccessService;
    private patService: PatService;
    private eventService: EventService;

    constructor(
        { userStore }: Pick<IUnleashStores, 'userStore'>,
        config: IUnleashConfig,
        accessService: AccessService,
        patService: PatService,
        eventService: EventService,
    ) {
        this.config = config;
        this.logger = config.getLogger('services/service-account-service.ts');
        this.userStore = userStore;
        this.accessService = accessService;
        this.patService = patService;
        this.eventService = eventService;
    }

    /**
     * Get all service accounts with their tokens and root roles
     */
    async getAll(): Promise<{
        serviceAccounts: IServiceAccount[];
        rootRoles: IRole[];
    }> {
        const serviceAccounts = await this.getAllServiceAccounts();
        const rootRoles = await this.accessService.getRootRoles();

        return {
            serviceAccounts,
            rootRoles,
        };
    }

    /**
     * Get all service accounts with their tokens
     */
    private async getAllServiceAccounts(): Promise<IServiceAccount[]> {
        // Query users where is_service = true
        const serviceAccountUsers = await this.userStore.getAllServiceAccounts();

        // Get tokens and root roles for each service account
        const serviceAccounts: IServiceAccount[] = await Promise.all(
            serviceAccountUsers.map(async (user) => {
                const tokens = await this.patService.getAll(user.id);
                const rootRole = await this.accessService.getRootRoleForUser(
                    user.id,
                );
                return {
                    id: user.id,
                    name: user.name ?? '',
                    username: user.username ?? '',
                    rootRole: rootRole.id,
                    createdAt: user.createdAt ?? new Date(),
                    seenAt: user.seenAt ?? null,
                    imageUrl: user.imageUrl ?? null,
                    tokens,
                };
            }),
        );

        return serviceAccounts;
    }

    /**
     * Get a single service account by ID
     */
    async get(id: number): Promise<IServiceAccount> {
        const user = await this.userStore.getByQuery({ id });

        if (!user) {
            throw new NotFoundError(`Service account with id ${id} not found`);
        }

        if (user.accountType !== 'Service Account') {
            throw new NotFoundError(
                `User with id ${id} is not a service account`,
            );
        }

        const tokens = await this.patService.getAll(id);
        const rootRole = await this.accessService.getRootRoleForUser(id);

        return {
            id: user.id,
            name: user.name ?? '',
            username: user.username ?? '',
            rootRole: rootRole.id,
            createdAt: user.createdAt ?? new Date(),
            seenAt: user.seenAt ?? null,
            imageUrl: user.imageUrl ?? null,
            tokens,
        };
    }

    async create(
        data: ICreateServiceAccount,
        auditUser: IAuditUser,
    ): Promise<IServiceAccount> {
        const { name, username, rootRole } = data;

        if (!name || name.trim() === '') {
            throw new BadDataError('Service account name is required');
        }

        if (!username || username.trim() === '') {
            throw new BadDataError('Service account username is required');
        }

        const existingUser = await this.userStore.hasUser({ username });
        if (existingUser) {
            throw new NameExistsError(
                `A user with username "${username}" already exists`,
            );
        }

        const user = await this.userStore.insertServiceAccount({
            name,
            username,
        });

        await this.accessService.setUserRootRole(user.id, rootRole);

        await this.eventService.storeEvent({
            type: SERVICE_ACCOUNT_CREATED,
            createdBy: auditUser.username,
            createdByUserId: auditUser.id,
            ip: auditUser.ip,
            data: {
                id: user.id,
                name,
                username,
                rootRole,
            },
        });

        this.logger.info(
            `Created service account "${name}" (id=${user.id}) with rootRole=${rootRole}`,
        );

        return this.get(user.id);
    }

    async update(
        id: number,
        data: IUpdateServiceAccount,
        auditUser: IAuditUser,
    ): Promise<IServiceAccount> {
        const existing = await this.get(id);

        const { name, rootRole } = data;

        if (name !== undefined) {
            await this.userStore.update(id, { name });
        }

        if (rootRole !== undefined) {
            await this.accessService.setUserRootRole(id, rootRole);
        }

        await this.eventService.storeEvent({
            type: SERVICE_ACCOUNT_UPDATED,
            createdBy: auditUser.username,
            createdByUserId: auditUser.id,
            ip: auditUser.ip,
            data: {
                id,
                name: name ?? existing.name,
                rootRole: rootRole ?? existing.rootRole,
            },
            preData: {
                id: existing.id,
                name: existing.name,
                rootRole: existing.rootRole,
            },
        });

        this.logger.info(`Updated service account id=${id}`);

        return this.get(id);
    }

    async delete(id: number, auditUser: IAuditUser): Promise<void> {
        const existing = await this.get(id);

        await this.userStore.delete(id);

        await this.eventService.storeEvent({
            type: SERVICE_ACCOUNT_DELETED,
            createdBy: auditUser.username,
            createdByUserId: auditUser.id,
            ip: auditUser.ip,
            preData: {
                id: existing.id,
                name: existing.name,
                username: existing.username,
                rootRole: existing.rootRole,
            },
        });

        this.logger.info(
            `Deleted service account "${existing.name}" (id=${id})`,
        );
    }

    async getTokens(serviceAccountId: number): Promise<PatSchema[]> {
        await this.get(serviceAccountId);
        return this.patService.getAll(serviceAccountId);
    }

    async createToken(
        serviceAccountId: number,
        data: { description: string; expiresAt: string },
        auditUser: IAuditUser,
    ): Promise<PatSchema & { secret: string }> {
        await this.get(serviceAccountId);
        const pat = await this.patService.createPat(
            data,
            serviceAccountId,
            auditUser,
        );
        return pat as PatSchema & { secret: string };
    }

    async deleteToken(
        serviceAccountId: number,
        tokenId: number,
        auditUser: IAuditUser,
    ): Promise<void> {
        await this.get(serviceAccountId);
        await this.patService.deletePat(
            tokenId,
            serviceAccountId,
            auditUser,
        );
    }
}
