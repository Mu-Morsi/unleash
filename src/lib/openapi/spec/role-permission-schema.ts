import type { FromSchema } from 'json-schema-to-ts';

/**
 * Schema for role permissions as returned by AccessService.getRole()
 * This matches the IPermission interface from model.ts
 *
 * Note: This is different from permissionSchema which matches IUserPermission
 * used in the /api/admin/user endpoint for user permissions.
 */
export const rolePermissionSchema = {
    $id: '#/components/schemas/rolePermissionSchema',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name', 'displayName', 'type'],
    description: 'A permission that can be assigned to a role',
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
            description: 'The environment that the permission applies to',
            example: 'development',
        },
    },
    components: {},
} as const;

export type RolePermissionSchema = FromSchema<typeof rolePermissionSchema>;
