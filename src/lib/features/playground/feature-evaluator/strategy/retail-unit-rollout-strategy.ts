import { Strategy } from './strategy.js';
import type { Context } from '../context.js';
import { normalizedStrategyValue } from './util.js';
import { resolveContextValue } from '../helpers.js';

const STICKINESS = {
    default: 'default',
    random: 'random',
};

export default class RetailUnitRolloutStrategy extends Strategy {
    private randomGenerator: Function = () =>
        `${Math.round(Math.random() * 10_000) + 1}`;

    constructor(randomGenerator?: Function) {
        super('retailUnitRollout');
        if (randomGenerator) {
            this.randomGenerator = randomGenerator;
        }
    }

    resolveStickiness(stickiness: string, context: Context): any {
        switch (stickiness) {
            case 'userId':
                return context.userId;
            case 'sessionId':
                return context.sessionId;
            case 'random':
                return this.randomGenerator();
            default:
                return (
                    context.userId ||
                    context.sessionId ||
                    this.randomGenerator()
                );
        }
    }

    isEnabled(
        parameters: {
            retailUnits?: string;
            groupId?: string;
            rollout?: number | string;
            stickiness?: string;
        },
        context: Context,
    ): boolean {
        const { retailUnits = '', rollout = 100, stickiness = 'default', groupId = '' } = parameters;

        // Get retail unit from context (could be a custom context field)
        const currentRetailUnit = resolveContextValue(context, 'retailUnit');

        if (!currentRetailUnit) {
            return false;
        }

        // Parse retail units list
        const allowedUnits = retailUnits
            .split(',')
            .map((unit) => unit.trim().toUpperCase());

        // Check if current retail unit is in the allowed list
        if (!allowedUnits.includes(String(currentRetailUnit).toUpperCase())) {
            return false;
        }

        // If rollout is 100%, enable for all users in selected retail units
        const rolloutPercentage = Number(rollout);
        if (rolloutPercentage === 100) {
            return true;
        }

        // Apply gradual rollout within the selected retail units
        const stickinessId = this.resolveStickiness(stickiness, context);

        if (!stickinessId) {
            return false;
        }

        const normalizedId = normalizedStrategyValue(
            stickinessId,
            groupId || this.name,
        );

        return rolloutPercentage > 0 && normalizedId <= rolloutPercentage;
    }
}
