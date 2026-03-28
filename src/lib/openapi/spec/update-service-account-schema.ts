/**
 * INGKA Fork: Update Service Account Schema
 * Defines the OpenAPI schema for updating an existing service account.
 */
import type { FromSchema } from 'json-schema-to-ts';

export const updateServiceAccountSchema = {
    $id: '#/components/schemas/updateServiceAccountSchema',
    type: 'object',
    additionalProperties: false,
    description: 'The request body for updating an existing service account.',
    properties: {
        name: {
            type: 'string',
            description: 'The new name for the service account.',
            example: 'Updated CI/CD Pipeline',
        },
        rootRole: {
            type: 'integer',
            description: 'The new root role ID to assign to this service account.',
            example: 3,
        },
    },
    components: {},
} as const;

export type UpdateServiceAccountSchema = FromSchema<
    typeof updateServiceAccountSchema
>;
