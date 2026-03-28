import type { FromSchema } from 'json-schema-to-ts';

// INGKA Fork: Schema for project creation response
export const projectCreatedSchema = {
    $id: '#/components/schemas/projectCreatedSchema',
    type: 'object',
    additionalProperties: true,
    required: ['id', 'name'],
    description: 'Response when a project is successfully created',
    properties: {
        id: {
            type: 'string',
            example: 'my-project',
            description: 'The id of the created project',
        },
        name: {
            type: 'string',
            example: 'My Project',
            description: 'The name of the created project',
        },
        description: {
            type: 'string',
            nullable: true,
            example: 'A project for my feature flags',
            description: 'A description of the project',
        },
        mode: {
            type: 'string',
            enum: ['open', 'protected', 'private'],
            example: 'open',
            description: 'The project collaboration mode',
        },
        defaultStickiness: {
            type: 'string',
            example: 'userId',
            description: 'The default stickiness for the project',
        },
        environments: {
            type: 'array',
            items: {
                type: 'string',
            },
            example: ['development', 'production'],
            description: 'The environments enabled for this project',
        },
        changeRequestEnvironments: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    requiredApprovals: { type: 'number' },
                },
            },
            description: 'Environments with change request configuration',
        },
    },
    components: {},
} as const;

export type ProjectCreatedSchema = FromSchema<typeof projectCreatedSchema>;
