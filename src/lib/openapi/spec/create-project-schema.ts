import type { FromSchema } from 'json-schema-to-ts';

// INGKA Fork: Schema for project creation request
export const createProjectSchema = {
    $id: '#/components/schemas/createProjectSchema',
    type: 'object',
    additionalProperties: false,
    required: ['name'],
    description: 'Data required to create a new project',
    properties: {
        id: {
            type: 'string',
            example: 'my-project',
            description:
                'The project id. If not provided, it will be generated from the name.',
            pattern: '^[a-z0-9]+(-[a-z0-9]+)*$',
        },
        name: {
            type: 'string',
            example: 'My Project',
            description: 'The name of the project',
            minLength: 1,
            maxLength: 100,
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
            description: 'The environments to enable for this project',
        },
    },
    components: {},
} as const;

export type CreateProjectSchema = FromSchema<typeof createProjectSchema>;
