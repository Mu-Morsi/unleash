/**
 * INGKA Fork: Groups Controller
 * Provides API endpoints for group management that were previously enterprise-only.
 * This enables user groups creation, modification, and user assignment in OSS.
 */

import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { GroupService } from '../../services/group-service.js';
import type { OpenApiService } from '../../services/openapi-service.js';
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
import { groupsSchema, type GroupsSchema } from '../../openapi/spec/groups-schema.js';
import { groupSchema, type GroupSchema } from '../../openapi/spec/group-schema.js';
import { createGroupSchema, type CreateGroupSchema } from '../../openapi/spec/create-group-schema.js';
import type { IGroupModel, ICreateGroupModel } from '../../types/group.js';
import { serializeDates } from '../../types/serialize-dates.js';

const version = 1;

interface GroupIdParam {
    id: string;
}

export class GroupsController extends Controller {
    private groupService: GroupService;

    private openApiService: OpenApiService;

    constructor(
        config: IUnleashConfig,
        {
            groupService,
            openApiService,
        }: Pick<IUnleashServices, 'groupService' | 'openApiService'>,
    ) {
        super(config);
        this.groupService = groupService;
        this.openApiService = openApiService;

        // GET /api/admin/groups - List all groups
        this.route({
            method: 'get',
            path: '',
            handler: this.getGroups,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getGroups',
                    summary: 'Get all groups',
                    description:
                        'Returns all user groups available in this Unleash instance.',
                    responses: {
                        200: createResponseSchema('groupsSchema'),
                        ...getStandardResponses(401, 403),
                    },
                }),
            ],
        });

        // GET /api/admin/groups/:id - Get a specific group
        this.route({
            method: 'get',
            path: '/:id',
            handler: this.getGroup,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'getGroup',
                    summary: 'Get a group',
                    description:
                        'Returns a specific group with its members.',
                    responses: {
                        200: createResponseSchema('groupSchema'),
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });

        // POST /api/admin/groups - Create a new group
        this.route({
            method: 'post',
            path: '',
            handler: this.createGroup,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'createGroup',
                    summary: 'Create a new group',
                    description:
                        'Creates a new user group.',
                    requestBody: createRequestSchema('createGroupSchema'),
                    responses: {
                        201: resourceCreatedResponseSchema('groupSchema'),
                        ...getStandardResponses(400, 401, 403, 409, 415),
                    },
                }),
            ],
        });

        // PUT /api/admin/groups/:id - Update a group
        this.route({
            method: 'put',
            path: '/:id',
            handler: this.updateGroup,
            permission: ADMIN,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'updateGroup',
                    summary: 'Update a group',
                    description:
                        'Updates an existing user group.',
                    requestBody: createRequestSchema('createGroupSchema'),
                    responses: {
                        200: createResponseSchema('groupSchema'),
                        ...getStandardResponses(400, 401, 403, 404, 409),
                    },
                }),
            ],
        });

        // DELETE /api/admin/groups/:id - Delete a group
        this.route({
            method: 'delete',
            path: '/:id',
            handler: this.deleteGroup,
            permission: ADMIN,
            acceptAnyContentType: true,
            middleware: [
                openApiService.validPath({
                    tags: ['Users'],
                    operationId: 'deleteGroup',
                    summary: 'Delete a group',
                    description:
                        'Deletes an existing user group.',
                    responses: {
                        200: emptyResponse,
                        ...getStandardResponses(401, 403, 404),
                    },
                }),
            ],
        });
    }

    async getGroups(
        req: Request,
        res: Response<GroupsSchema>,
    ): Promise<void> {
        const groups = await this.groupService.getAll();
        this.openApiService.respondWithValidation(
            200,
            res,
            groupsSchema.$id,
            { groups: serializeDates(groups) },
        );
    }

    async getGroup(
        req: Request<GroupIdParam>,
        res: Response<GroupSchema>,
    ): Promise<void> {
        const id = Number(req.params.id);
        const group = await this.groupService.getGroup(id);
        this.openApiService.respondWithValidation(
            200,
            res,
            groupSchema.$id,
            serializeDates(group),
        );
    }

    async createGroup(
        req: IAuthRequest<unknown, unknown, CreateGroupSchema>,
        res: Response<GroupSchema>,
    ): Promise<void> {
        const groupData: ICreateGroupModel = {
            name: req.body.name,
            description: req.body.description ?? undefined,
            mappingsSSO: req.body.mappingsSSO,
            rootRole: req.body.rootRole ?? undefined,
            users: req.body.users?.map(u => ({ user: { id: u.user.id } })),
        };

        const newGroup = await this.groupService.createGroup(
            groupData,
            req.audit,
        );

        this.openApiService.respondWithValidation(
            201,
            res,
            groupSchema.$id,
            serializeDates(newGroup),
            { location: `groups/${newGroup.id}` },
        );
    }

    async updateGroup(
        req: IAuthRequest<GroupIdParam, unknown, CreateGroupSchema>,
        res: Response<GroupSchema>,
    ): Promise<void> {
        const id = Number(req.params.id);
        const groupData: IGroupModel = {
            id,
            name: req.body.name,
            description: req.body.description ?? undefined,
            mappingsSSO: req.body.mappingsSSO,
            rootRole: req.body.rootRole ?? undefined,
            users: req.body.users?.map(u => ({
                user: { id: u.user.id } as any,
            })) ?? [],
        };

        const updatedGroup = await this.groupService.updateGroup(
            groupData,
            req.audit,
        );

        this.openApiService.respondWithValidation(
            200,
            res,
            groupSchema.$id,
            serializeDates(updatedGroup),
        );
    }

    async deleteGroup(
        req: IAuthRequest<GroupIdParam>,
        res: Response,
    ): Promise<void> {
        const id = Number(req.params.id);
        await this.groupService.deleteGroup(id, req.audit);
        res.status(200).end();
    }
}
