/**
 * INGKA Fork: Create Service Account Schema
 * Defines the OpenAPI schema for creating a new service account.
 */
import type { FromSchema } from 'json-schema-to-ts';

export const createServiceAccountSchema = {
    $id: '#/components/schemas/createServiceAccountSchema',
    type: 'object',
    additionalProperties: false,
    required: ['name', 'username', 'rootRole'],
    description: 'The request body for creating a new service account.',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the service account.',
            example: 'CI/CD Pipeline',
        },
        username: {
            type: 'string',
            description: 'The username of the service account. Must be unique.',
            example: 'ci-cd-pipeline',
        },
        rootRole: {
            type: 'integer',
            description: 'The root role ID to assign to this service account.',
            example: 2,
        },
    },
    components: {},
} as const;

export type CreateServiceAccountSchema = FromSchema<
    typeof createServiceAccountSchema
>;
