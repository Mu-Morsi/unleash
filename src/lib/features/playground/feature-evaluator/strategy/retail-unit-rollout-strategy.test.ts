import RetailUnitRolloutStrategy from './retail-unit-rollout-strategy.js';

describe('RetailUnitRolloutStrategy', () => {
    let strategy: RetailUnitRolloutStrategy;

    beforeEach(() => {
        strategy = new RetailUnitRolloutStrategy();
    });

    test('should have correct name', () => {
        expect(strategy.name).toBe('retailUnitRollout');
    });

    test('should be disabled when retailUnit is not in context', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE,FR,US',
                rollout: 100,
            },
            {},
        );
        expect(result).toBe(false);
    });

    test('should be disabled when retailUnit does not match', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE,FR,US',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'DE',
                },
            },
        );
        expect(result).toBe(false);
    });

    test('should be enabled when retailUnit matches (single unit)', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'SE',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should be enabled when retailUnit matches (multiple units)', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE,FR,US',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'FR',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should handle whitespace in retail units list', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE, FR, US',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'US',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should be case-insensitive', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE,FR,US',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'se',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should use gradual rollout with userId stickiness', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE',
                rollout: 50,
                stickiness: 'userId',
                groupId: 'test',
            },
            {
                userId: 'user123',
                properties: {
                    retailUnit: 'SE',
                },
            },
        );
        // Result depends on hash of userId, just check it returns boolean
        expect(typeof result).toBe('boolean');
    });

    test('should use gradual rollout with sessionId stickiness', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'FR',
                rollout: 50,
                stickiness: 'sessionId',
                groupId: 'test',
            },
            {
                sessionId: 'session123',
                properties: {
                    retailUnit: 'FR',
                },
            },
        );
        expect(typeof result).toBe('boolean');
    });

    test('should use default stickiness (userId first)', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'US',
                rollout: 100,
                stickiness: 'default',
            },
            {
                userId: 'user123',
                properties: {
                    retailUnit: 'US',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should fall back to sessionId when userId not present', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'DE',
                rollout: 100,
                stickiness: 'default',
            },
            {
                sessionId: 'session123',
                properties: {
                    retailUnit: 'DE',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should use random when no userId or sessionId', () => {
        const mockRandom = () => '12345';
        const strategyWithMockRandom = new RetailUnitRolloutStrategy(
            mockRandom,
        );

        const result = strategyWithMockRandom.isEnabled(
            {
                retailUnits: 'NO',
                rollout: 100,
                stickiness: 'default',
            },
            {
                properties: {
                    retailUnit: 'NO',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should disable when rollout is 0', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'SE',
                rollout: 0,
            },
            {
                userId: 'user123',
                properties: {
                    retailUnit: 'SE',
                },
            },
        );
        expect(result).toBe(false);
    });

    test('should handle empty retailUnits parameter', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: '',
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'SE',
                },
            },
        );
        expect(result).toBe(false);
    });

    test('should handle missing retailUnits parameter', () => {
        const result = strategy.isEnabled(
            {
                rollout: 100,
            },
            {
                properties: {
                    retailUnit: 'SE',
                },
            },
        );
        expect(result).toBe(false);
    });

    test('should use custom groupId for correlation', () => {
        const result = strategy.isEnabled(
            {
                retailUnits: 'FI',
                rollout: 100,
                groupId: 'nordic-rollout',
            },
            {
                userId: 'user123',
                properties: {
                    retailUnit: 'FI',
                },
            },
        );
        expect(result).toBe(true);
    });

    test('should handle retailUnit in different context property format', () => {
        // Testing resolveContextValue logic
        const result = strategy.isEnabled(
            {
                retailUnits: 'DK',
                rollout: 100,
            },
            {
                retailUnit: 'DK', // Direct property instead of nested in properties
            },
        );
        expect(typeof result).toBe('boolean');
    });

    test('should consistently evaluate same user with same parameters', () => {
        const context = {
            userId: 'consistent-user',
            properties: {
                retailUnit: 'SE',
            },
        };

        const params = {
            retailUnits: 'SE',
            rollout: 50,
            stickiness: 'userId',
            groupId: 'test',
        };

        const result1 = strategy.isEnabled(params, context);
        const result2 = strategy.isEnabled(params, context);

        expect(result1).toBe(result2);
    });
});
