/**
 * INGKA Fork: Service Account Controller
 * Provides REST API endpoints for service account management that were previously enterprise-only.
 * This enables full service account CRUD operations in OSS.
 */

import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import type { ServiceAccountService } from '../../services/service-account-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import Controller from '../controller.js';
import { ADMIN } from '../../types/permissions.js';
import { createRequestSchema } from '../../openapi/util/create-request-schema.js';
import {
    createResponseSchema,
    resourceCreatedResponseSchema,
} from '../../openapi/util/create-response-schema.js';
import {
    emptyResponse,
    getStandardResponses,
} from '../../openapi/util/standard-responses.js';
import {
    serviceAccountsSchema,
    type ServiceAccountsSchema,
} from '../../openapi/spec/service-accounts-schema.js';
import {
    serviceAccountSchema,
    type ServiceAccountSchema,
} from '../../openapi/spec/service-account-schema.js';
import type { CreateServiceAccountSchema } from '../../openapi/spec/create-service-account-schema.js';
import type { UpdateServiceAccountSchema } from '../../openapi/spec/update-service-account-schema.js';
import { serializeDates } from '../../types/serialize-dates.js';

const version = 1;

interface ServiceAccountIdParam {
    id: string;
}

export class ServiceAccountController extends Controller {
    private serviceAccountService: ServiceAccountService;
    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            serviceAccountService,
            openApiService,
        }: Pick<IUnleashServices, 'serviceAccountService' | 'openApiService'>,
    ) {
        super(config);
        this.serviceAccountService = serviceAccountService;
        this.openApiService = openApiService;

        // GET /api/admin/service-accounts - List all service accounts
        this.route({
            method: 'get',
            path: '',
            handler: this.getServiceAccounts,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'getServiceAccounts',
                    summary: 'Get all service accounts',
                    description:
                        'Returns all service accounts available in this Unleash instance with their tokens and root roles.',
                    responses: {
                        200: createResponseSchema('serviceAccountsSchema'),
                        ...getStandardResponses(401, 403),
                    },
                }),
            ],
        });

        // GET /api/admin/service-accounts/:id - Get a specific service account
        this.route({
            method: 'get',
            path: '/:id',
            handler: this.getServiceAccount,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'getServiceAccount',
                    summary: 'Get a service account',
                    description:
                        'Returns a specific service account with its tokens.',
                    responses: {
                        200: createResponseSchema('serviceAccountSchema'),
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });

        // POST /api/admin/service-accounts - Create a new service account
        this.route({
            method: 'post',
            path: '',
            handler: this.createServiceAccount,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'createServiceAccount',
                    summary: 'Create a new service account',
                    description:
                        'Creates a new service account with the specified name, username and root role.',
                    requestBody: createRequestSchema(
                        'createServiceAccountSchema',
                    ),
                    responses: {
                        201: resourceCreatedResponseSchema(
                            'serviceAccountSchema',
                        ),
                        ...getStandardResponses(400, 401, 403, 409, 415),
                    },
                }),
            ],
        });

        // PUT /api/admin/service-accounts/:id - Update a service account
        this.route({
            method: 'put',
            path: '/:id',
            handler: this.updateServiceAccount,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'updateServiceAccount',
                    summary: 'Update a service account',
                    description:
                        'Updates an existing service account name or root role.',
                    requestBody: createRequestSchema(
                        'updateServiceAccountSchema',
                    ),
                    responses: {
                        200: createResponseSchema('serviceAccountSchema'),
                        ...getStandardResponses(400, 401, 403, 404, 409),
                    },
                }),
            ],
        });

        // DELETE /api/admin/service-accounts/:id - Delete a service account
        this.route({
            method: 'delete',
            path: '/:id',
            handler: this.deleteServiceAccount,
            permission: ADMIN,
            acceptAnyContentType: true,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'deleteServiceAccount',
                    summary: 'Delete a service account',
                    description: 'Deletes an existing service account.',
                    responses: {
                        200: emptyResponse,
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });

        // GET /api/admin/service-account/:id/token - Get all tokens for a service account
        this.route({
            method: 'get',
            path: '/:id/token',
            handler: this.getServiceAccountTokens,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'getServiceAccountTokens',
                    summary: 'Get service account tokens',
                    description:
                        'Returns all personal access tokens for a service account.',
                    responses: {
                        200: createResponseSchema('patsSchema'),
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });

        // POST /api/admin/service-account/:id/token - Create a token for a service account
        this.route({
            method: 'post',
            path: '/:id/token',
            handler: this.createServiceAccountToken,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'createServiceAccountToken',
                    summary: 'Create a service account token',
                    description:
                        'Creates a new personal access token for a service account.',
                    requestBody: createRequestSchema('createPatSchema'),
                    responses: {
                        201: resourceCreatedResponseSchema('patSchema'),
                        ...getStandardResponses(400, 401, 403, 404, 415),
                    },
                }),
            ],
        });

        // DELETE /api/admin/service-account/:id/token/:tokenId - Delete a token
        this.route({
            method: 'delete',
            path: '/:id/token/:tokenId',
            handler: this.deleteServiceAccountToken,
            permission: ADMIN,
            acceptAnyContentType: true,
            middleware: [
                openApiService.validPath({
                    tags: ['Service Accounts'],
                    operationId: 'deleteServiceAccountToken',
                    summary: 'Delete a service account token',
                    description:
                        'Deletes a personal access token from a service account.',
                    responses: {
                        200: emptyResponse,
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });
    }

    async getServiceAccounts(
        req: Request,
        res: Response<ServiceAccountsSchema>,
    ): Promise<void> {
        const { serviceAccounts, rootRoles } =
            await this.serviceAccountService.getAll();
        this.openApiService.respondWithValidation(
            200,
            res,
            serviceAccountsSchema.$id,
            {
                serviceAccounts: serializeDates(serviceAccounts),
                rootRoles: serializeDates(rootRoles),
            } as unknown as ServiceAccountsSchema,
        );
    }

    async getServiceAccount(
        req: Request<ServiceAccountIdParam>,
        res: Response<ServiceAccountSchema>,
    ): Promise<void> {
        const id = Number(req.params.id);
        const serviceAccount = await this.serviceAccountService.get(id);
        this.openApiService.respondWithValidation(
            200,
            res,
            serviceAccountSchema.$id,
            serializeDates(serviceAccount) as unknown as ServiceAccountSchema,
        );
    }

    async createServiceAccount(
        req: IAuthRequest<unknown, unknown, CreateServiceAccountSchema>,
        res: Response<ServiceAccountSchema>,
    ): Promise<void> {
        const { name, username, rootRole } = req.body;

        const serviceAccount = await this.serviceAccountService.create(
            { name, username, rootRole },
            req.audit,
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            serviceAccountSchema.$id,
            serializeDates(serviceAccount) as unknown as ServiceAccountSchema,
            { location: `service-account/${serviceAccount.id}` },
        );
    }

    async updateServiceAccount(
        req: IAuthRequest<ServiceAccountIdParam, unknown, UpdateServiceAccountSchema>,
        res: Response<ServiceAccountSchema>,
    ): Promise<void> {
        const id = Number(req.params.id);
        const { name, rootRole } = req.body;

        const serviceAccount = await this.serviceAccountService.update(
            id,
            { name, rootRole },
            req.audit,
        );

        this.openApiService.respondWithValidation(
            200,
            res,
            serviceAccountSchema.$id,
            serializeDates(serviceAccount) as unknown as ServiceAccountSchema,
        );
    }

    async deleteServiceAccount(
        req: IAuthRequest<ServiceAccountIdParam>,
        res: Response,
    ): Promise<void> {
        const id = Number(req.params.id);

        await this.serviceAccountService.delete(id, req.audit);

        res.status(200).send();
    }

    async getServiceAccountTokens(
        req: Request<ServiceAccountIdParam>,
        res: Response,
    ): Promise<void> {
        const id = Number(req.params.id);
        const tokens = await this.serviceAccountService.getTokens(id);
        this.openApiService.respondWithValidation(200, res, 'patsSchema', {
            pats: serializeDates(tokens),
        });
    }

    async createServiceAccountToken(
        req: IAuthRequest<ServiceAccountIdParam, unknown, { description: string; expiresAt: string }>,
        res: Response,
    ): Promise<void> {
        const id = Number(req.params.id);
        const { description, expiresAt } = req.body;

        const token = await this.serviceAccountService.createToken(
            id,
            { description, expiresAt },
            req.audit,
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            'patSchema',
            serializeDates(token),
            { location: `service-account/${id}/token/${token.id}` },
        );
    }

    async deleteServiceAccountToken(
        req: IAuthRequest<{ id: string; tokenId: string }>,
        res: Response,
    ): Promise<void> {
        const id = Number(req.params.id);
        const tokenId = Number(req.params.tokenId);

        await this.serviceAccountService.deleteToken(id, tokenId, req.audit);

        res.status(200).send();
    }
}
