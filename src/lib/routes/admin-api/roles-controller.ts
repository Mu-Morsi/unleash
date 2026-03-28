/**
 * INGKA Fork: Roles Controller
 * Provides API endpoints for role management that were previously enterprise-only.
 * This enables custom role creation, modification, and permission assignment in OSS.
 */

import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { AccessService } from '../../services/access-service.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import type { IAuthRequest } from '../unleash-types.js';
import Controller from '../controller.js';
import { ADMIN, READ_ROLE } from '../../types/permissions.js';
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
    rolesSchema,
    type RolesSchema,
} from '../../openapi/spec/roles-schema.js';
import {
    roleWithPermissionsSchema,
    type RoleWithPermissionsSchema,
} from '../../openapi/spec/role-with-permissions-schema.js';
import {
    availablePermissionsSchema,
    type AvailablePermissionsSchema,
} from '../../openapi/spec/available-permissions-schema.js';
import type { CreateRoleSchema } from '../../openapi/spec/create-role-schema.js';
import type { UpdateRoleSchema } from '../../openapi/spec/update-role-schema.js';
import type {
    IRole,
    IRoleWithPermissions,
} from '../../types/stores/access-store.js';
import {
    CUSTOM_ROOT_ROLE_TYPE,
    CUSTOM_PROJECT_ROLE_TYPE,
} from '../../util/constants.js';

const version = 1;

interface RoleIdParam {
    id: string;
}

export class RolesController extends Controller {
    private accessService: AccessService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            accessService,
            openApiService,
        }: Pick<IUnleashServices, 'accessService' | 'openApiService'>,
    ) {
        super(config);
        this.accessService = accessService;
        this.openApiService = openApiService;

        // GET /api/admin/roles - List all roles
        this.route({
            method: 'get',
            path: '',
            handler: this.getRoles,
            permission: READ_ROLE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getRoles',
                    summary: 'Get all roles',
                    description:
                        'Returns all roles (both predefined and custom) available in this Unleash instance.',
                    responses: {
                        200: createResponseSchema('rolesSchema'),
                        ...getStandardResponses(401, 403),
                    },
                }),
            ],
        });

        // GET /api/admin/permissions - Get available permissions
        this.route({
            method: 'get',
            path: '/permissions',
            handler: this.getPermissions,
            permission: READ_ROLE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getAvailablePermissions',
                    summary: 'Get available permissions',
                    description:
                        'Returns all available permissions that can be assigned to roles, organized by type (root, project, environment).',
                    responses: {
                        200: createResponseSchema('availablePermissionsSchema'),
                        ...getStandardResponses(401, 403),
                    },
                }),
            ],
        });

        // POST /api/admin/roles/validate - Validate role data
        this.route({
            method: 'post',
            path: '/validate',
            handler: this.validateRole,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'validateRole',
                    summary: 'Validate role data',
                    description:
                        'Validates role data before creating or updating a role.',
                    requestBody: createRequestSchema('createRoleSchema'),
                    responses: {
                        200: emptyResponse,
                        ...getStandardResponses(400, 401, 403, 409),
                    },
                }),
            ],
        });

        // GET /api/admin/roles/:id - Get a specific role
        this.route({
            method: 'get',
            path: '/:id',
            handler: this.getRole,
            permission: READ_ROLE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getRole',
                    summary: 'Get a role',
                    description:
                        'Returns a specific role with its assigned permissions.',
                    responses: {
                        200: createResponseSchema('roleWithPermissionsSchema'),
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });

        // POST /api/admin/roles - Create a new role
        this.route({
            method: 'post',
            path: '',
            handler: this.createRole,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'createRole',
                    summary: 'Create a new role',
                    description:
                        'Creates a new custom role with the specified permissions.',
                    requestBody: createRequestSchema('createRoleSchema'),
                    responses: {
                        201: resourceCreatedResponseSchema(
                            'roleWithPermissionsSchema',
                        ),
                        ...getStandardResponses(400, 401, 403, 409, 415),
                    },
                }),
            ],
        });

        // PUT /api/admin/roles/:id - Update a role
        this.route({
            method: 'put',
            path: '/:id',
            handler: this.updateRole,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'updateRole',
                    summary: 'Update a role',
                    description:
                        'Updates an existing custom role with new permissions.',
                    requestBody: createRequestSchema('updateRoleSchema'),
                    responses: {
                        200: createResponseSchema('roleWithPermissionsSchema'),
                        ...getStandardResponses(400, 401, 403, 404, 409),
                    },
                }),
            ],
        });

        // DELETE /api/admin/roles/:id - Delete a role
        this.route({
            method: 'delete',
            path: '/:id',
            handler: this.deleteRole,
            permission: ADMIN,
            acceptAnyContentType: true,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'deleteRole',
                    summary: 'Delete a role',
                    description:
                        'Deletes a custom role. Built-in roles cannot be deleted.',
                    responses: {
                        200: emptyResponse,
                        ...getStandardResponses(400, 401, 403, 404),
                    },
                }),
            ],
        });
    }

    async getRoles(req: Request, res: Response<RolesSchema>): Promise<void> {
        const roles = await this.accessService.getRoles();
        this.openApiService.respondWithValidation(200, res, rolesSchema.$id, {
            version,
            roles: roles as IRole[],
        });
    }

    async getRole(
        req: Request<RoleIdParam>,
        res: Response<RoleWithPermissionsSchema>,
    ): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const role = await this.accessService.getRole(id);
        this.openApiService.respondWithValidation(
            200,
            res,
            roleWithPermissionsSchema.$id,
            role as unknown as RoleWithPermissionsSchema,
        );
    }

    async getPermissions(
        req: Request,
        res: Response<AvailablePermissionsSchema>,
    ): Promise<void> {
        const permissions = await this.accessService.getPermissions();
        this.openApiService.respondWithValidation(
            200,
            res,
            availablePermissionsSchema.$id,
            { permissions },
        );
    }

    async createRole(
        req: IAuthRequest<unknown, unknown, CreateRoleSchema>,
        res: Response<RoleWithPermissionsSchema>,
    ): Promise<void> {
        const rolePayload = req.body;
        // Convert frontend type to backend type
        const roleType =
            rolePayload.type === 'custom-root-role'
                ? CUSTOM_ROOT_ROLE_TYPE
                : CUSTOM_PROJECT_ROLE_TYPE;
        const createdRole = await this.accessService.createRole(
            {
                name: rolePayload.name,
                description: rolePayload.description || '',
                type: roleType,
                permissions: rolePayload.permissions,
                createdByUserId: req.user.id,
            },
            req.audit,
        );

        const roleWithPermissions = await this.accessService.getRole(
            createdRole.id,
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            roleWithPermissionsSchema.$id,
            roleWithPermissions as unknown as RoleWithPermissionsSchema,
            { location: `roles/${createdRole.id}` },
        );
    }

    async updateRole(
        req: IAuthRequest<RoleIdParam, unknown, UpdateRoleSchema>,
        res: Response<RoleWithPermissionsSchema>,
    ): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const rolePayload = req.body;
        // Convert frontend type to backend type
        const roleType =
            rolePayload.type === 'custom-root-role'
                ? CUSTOM_ROOT_ROLE_TYPE
                : CUSTOM_PROJECT_ROLE_TYPE;

        const updatedRole = await this.accessService.updateRole(
            {
                id,
                name: rolePayload.name,
                description: rolePayload.description || '',
                type: roleType,
                permissions: rolePayload.permissions,
                createdByUserId: req.user.id,
            },
            req.audit,
        );

        const roleWithPermissions = await this.accessService.getRole(
            updatedRole.id,
        );

        this.openApiService.respondWithValidation(
            200,
            res,
            roleWithPermissionsSchema.$id,
            roleWithPermissions as unknown as RoleWithPermissionsSchema,
        );
    }

    async deleteRole(
        req: IAuthRequest<RoleIdParam>,
        res: Response,
    ): Promise<void> {
        const id = parseInt(req.params.id, 10);
        await this.accessService.deleteRole(id, req.audit);
        res.status(200).end();
    }

    async validateRole(
        req: IAuthRequest<unknown, unknown, CreateRoleSchema>,
        res: Response,
    ): Promise<void> {
        const rolePayload = req.body;
        await this.accessService.validateRole({
            name: rolePayload.name,
            description: rolePayload.description || '',
            permissions: rolePayload.permissions,
        });
        res.status(200).end();
    }
}

export default RolesController;
