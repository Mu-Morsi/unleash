/**
 * INGKA Fork: Service Account Schema
 * Defines the OpenAPI schema for service accounts.
 */
import type { FromSchema } from 'json-schema-to-ts';

export const serviceAccountSchema = {
    $id: '#/components/schemas/serviceAccountSchema',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name', 'username', 'createdAt'],
    description: 'A service account represents a non-human user that can interact with the Unleash API.',
    properties: {
        id: {
            type: 'integer',
            description: 'The unique identifier for this service account.',
            example: 1,
        },
        name: {
            type: 'string',
            description: 'The name of the service account.',
            example: 'CI/CD Pipeline',
        },
        username: {
            type: 'string',
            description: 'The username of the service account.',
            example: 'ci-cd-pipeline',
        },
        rootRole: {
            type: 'integer',
            description: 'The root role ID assigned to this service account.',
            example: 2,
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time when the service account was created.',
            example: '2023-06-28T14:32:04.123Z',
        },
        seenAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'The date and time when the service account was last seen.',
            example: '2023-06-28T14:32:04.123Z',
        },
        imageUrl: {
            type: 'string',
            nullable: true,
            description: 'A URL pointing to the service account\'s image.',
            example: 'https://example.com/image.png',
        },
        tokens: {
            type: 'array',
            description: 'The personal access tokens belonging to this service account.',
            items: {
                $ref: '#/components/schemas/patSchema',
            },
        },
    },
    components: {},
} as const;

export type ServiceAccountSchema = FromSchema<typeof serviceAccountSchema>;
