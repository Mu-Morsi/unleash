import type { FromSchema } from 'json-schema-to-ts';
import { roleSchema } from './role-schema.js';
import { rolePermissionSchema } from './role-permission-schema.js';

export const roleWithPermissionsSchema = {
    $id: '#/components/schemas/roleWithPermissionsSchema',
    type: 'object',
    description: 'A role with its assigned permissions',
    additionalProperties: false,
    required: [...roleSchema.required, 'permissions'],
    properties: {
        ...roleSchema.properties,
        permissions: {
            type: 'array',
            description: 'The permissions assigned to this role',
            items: {
                $ref: '#/components/schemas/rolePermissionSchema',
            },
        },
    },
    components: {
        schemas: {
            rolePermissionSchema,
        },
    },
} as const;

export type RoleWithPermissionsSchema = FromSchema<
    typeof roleWithPermissionsSchema
>;
