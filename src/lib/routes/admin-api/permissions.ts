/**
 * INGKA Fork: Permissions Controller
 * Provides the /api/admin/permissions endpoint that returns available permissions.
 * This endpoint is required by the frontend RolePermissionCategories component
 * to display the permission checkboxes when creating/editing custom roles.
 */

import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { AccessService } from '../../services/access-service.js';
import type { OpenApiService } from '../../services/openapi-service.js';
import Controller from '../controller.js';
import { READ_ROLE } from '../../types/permissions.js';
import { createResponseSchema } from '../../openapi/util/create-response-schema.js';
import { getStandardResponses } from '../../openapi/util/standard-responses.js';
import {
    availablePermissionsSchema,
    type AvailablePermissionsSchema,
} from '../../openapi/spec/available-permissions-schema.js';

export class PermissionsController extends Controller {
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

        // GET /api/admin/permissions - Get available permissions
        this.route({
            method: 'get',
            path: '',
            handler: this.getPermissions,
            permission: READ_ROLE,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getAvailablePermissions',
                    summary: 'Get available permissions',
                    description:
                        'Returns all available permissions that can be assigned to roles, organized by type (root, project, environment). This endpoint is used by the role creation/editing UI to populate the permissions selector.',
                    responses: {
                        200: createResponseSchema('availablePermissionsSchema'),
                        ...getStandardResponses(401, 403),
                    },
                }),
            ],
        });
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
}

export default PermissionsController;
