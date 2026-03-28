import type { FromSchema } from 'json-schema-to-ts';

export const updateRoleSchema = {
    $id: '#/components/schemas/updateRoleSchema',
    type: 'object',
    description: 'Schema for updating an existing custom role',
    additionalProperties: false,
    required: ['name', 'permissions'],
    properties: {
        name: {
            type: 'string',
            description: 'The name of the role',
            example: 'Feature Manager',
        },
        description: {
            type: 'string',
            description: 'A description of the role',
            example: 'A role that can manage feature flags',
        },
        type: {
            type: 'string',
            description:
                'The type of role. Either "custom" for project roles or "custom-root-role" for root roles',
            example: 'custom',
            enum: ['custom', 'custom-root-role'],
        },
        permissions: {
            type: 'array',
            description: 'The permissions to assign to this role',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the permission',
                        example: 'CREATE_FEATURE',
                    },
                    environment: {
                        type: 'string',
                        description:
                            'The environment the permission applies to (for environment permissions)',
                        example: 'development',
                    },
                },
            },
        },
    },
    components: {},
} as const;

export type UpdateRoleSchema = FromSchema<typeof updateRoleSchema>;
