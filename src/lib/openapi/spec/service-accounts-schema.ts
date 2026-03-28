/**
 * INGKA Fork: Service Accounts Schema
 * Defines the OpenAPI schema for listing all service accounts.
 */
import type { FromSchema } from 'json-schema-to-ts';
import { serviceAccountSchema } from './service-account-schema.js';

export const serviceAccountsSchema = {
    $id: '#/components/schemas/serviceAccountsSchema',
    type: 'object',
    additionalProperties: false,
    required: ['serviceAccounts', 'rootRoles'],
    description: 'A list of service accounts with their associated root roles.',
    properties: {
        serviceAccounts: {
            type: 'array',
            description: 'A list of service accounts.',
            items: {
                $ref: '#/components/schemas/serviceAccountSchema',
            },
        },
        rootRoles: {
            type: 'array',
            description: 'A list of root roles available for assignment.',
            items: {
                $ref: '#/components/schemas/roleSchema',
            },
        },
    },
    components: {
        schemas: {
            serviceAccountSchema,
        },
    },
} as const;

export type ServiceAccountsSchema = FromSchema<typeof serviceAccountsSchema>;
