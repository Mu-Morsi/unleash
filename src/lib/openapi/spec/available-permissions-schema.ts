import type { FromSchema } from 'json-schema-to-ts';

const permissionItem = {
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name', 'displayName', 'type'],
    properties: {
        id: {
            type: 'integer',
            description: 'The ID of the permission',
            example: 1,
        },
        name: {
            type: 'string',
            description: 'The name of the permission',
            example: 'CREATE_FEATURE_STRATEGY',
        },
        displayName: {
            type: 'string',
            description: 'The display name of the permission',
            example: 'Create activation strategies',
        },
        type: {
            type: 'string',
            description: 'The type of the permission (root, project, or environment)',
            example: 'environment',
        },
        environment: {
            type: 'string',
            nullable: true,
            description: 'The environment that the permission applies to (for environment permissions)',
            example: 'development',
        },
    },
} as const;

const environmentPermissions = {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'permissions'],
    properties: {
        name: {
            type: 'string',
            description: 'The name of the environment',
            example: 'development',
        },
        permissions: {
            type: 'array',
            description: 'The list of permissions for this environment',
            items: permissionItem,
        },
    },
} as const;

export const availablePermissionsSchema = {
    $id: '#/components/schemas/availablePermissionsSchema',
    type: 'object',
    description: 'Available permissions that can be assigned to roles',
    additionalProperties: false,
    required: ['permissions'],
    properties: {
        permissions: {
            type: 'object',
            description: 'The available permissions grouped by type',
            additionalProperties: false,
            required: ['root', 'project', 'environments'],
            properties: {
                root: {
                    type: 'array',
                    description: 'Root-level permissions that apply globally',
                    items: permissionItem,
                },
                project: {
                    type: 'array',
                    description: 'Project-level permissions',
                    items: permissionItem,
                },
                environments: {
                    type: 'array',
                    description: 'Environment-specific permissions grouped by environment',
                    items: environmentPermissions,
                },
            },
        },
    },
    components: {},
} as const;

export type AvailablePermissionsSchema = FromSchema<
    typeof availablePermissionsSchema
>;
