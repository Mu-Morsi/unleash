# Retail Unit Rollout Strategy

A custom Unleash strategy for gradually rolling out features to specific retail units (country codes).

## Overview

This strategy allows you to:
- Target specific retail units (country codes like SE, FR, US, DE, NO, etc.)
- Gradually roll out features within selected retail units using percentage-based rollout
- Ensure consistent user experience with stickiness
- Select retail units from a pre-defined list using a multi-select dropdown

## Retail Unit Context Field

The strategy uses the `retailUnit` context field which includes legal values for retail unit codes. This provides:
- A curated list of valid retail unit codes
- Descriptions for each code (e.g., "SE" → "Sweden")
- A user-friendly multi-select interface in the Unleash UI
- Validation to ensure only valid retail units are selected

### Available Retail Units

The system includes 31 pre-configured retail units:

- Australia (AU), Austria (AT), Belgium (BE)
- Canada (CA), China (CN), Croatia (HR), Czech Republic (CZ)
- Denmark (DK), Finland (FI), France (FR)
- Germany (DE), Hungary (HU)
- India (IN), Ireland (IE), Italy (IT)
- Japan (JP)
- Netherlands (NL), New Zealand (NZ), Norway (NO)
- Poland (PL), Portugal (PT)
- Romania (RO), Serbia (RS), Slovakia (SK), Slovenia (SI), South Korea (KR), Spain (ES), Sweden (SE), Switzerland (CH)
- United Kingdom (GB), United States of America (US)

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `retailUnits` | list | Yes | Selected retail unit codes from dropdown (e.g., SE, FR, US, DE) |
| `rollout` | percentage | No | Percentage of users within selected retail units to enable (0-100). Default: 100 |
| `stickiness` | string | No | Consistency method: `default`, `userId`, `sessionId`, or `random`. Default: `default` |
| `groupId` | string | No | Used to correlate rollout across multiple feature flags |

## Usage

### 1. Add Retail Unit to Context

When calling Unleash, include the retail unit in your context:

```javascript
const context = {
  userId: 'user123',
  properties: {
    retailUnit: 'SE'  // Must match one of the legal values (SE, FR, US, etc.)
  }
};

const isEnabled = await unleash.isEnabled('myFeature', context);
```

### 2. Configure Strategy in Unleash UI

1. Create or edit a feature flag
2. Add a new strategy
3. Select "Retail unit rollout" from the strategy dropdown
4. Configure parameters:
   - **Retail Units**: Select one or more retail units from the dropdown (shows description, e.g., "Sweden" for SE)
   - **Rollout**: Set the percentage (e.g., `50` for 50%)
   - **Stickiness**: Choose how to ensure consistency (default: `default`)
   - **GroupId**: Optional, for correlating multiple flags

## Examples

### Example 1: Full rollout to specific markets

Target all users in Sweden, France, and United States:

```
retailUnits: ["SE", "FR", "US"]  // Selected from dropdown
rollout: 100
stickiness: default
```

### Example 2: Gradual rollout in Germany

Enable for 25% of users in Germany:

```
retailUnits: ["DE"]  // Selected from dropdown
rollout: 25
stickiness: userId
```

### Example 3: Canary release to Nordic countries

Test with 10% of users in Nordic markets:

```
retailUnits: ["SE", "NO", "DK", "FI"]  // Selected from dropdown
rollout: 10
stickiness: userId
groupId: "nordic-canary"
```

## How It Works

1. The strategy checks if the current request's `retailUnit` context matches any of the selected retail units
2. If no match, the feature is disabled
3. If there's a match:
   - With 100% rollout: Enable for all users in those retail units
   - With < 100% rollout: Use stickiness + percentage to determine if enabled

## Implementation Details

### Context Field Setup

The `retailUnit` context field is automatically created during migration with:
- 31 pre-configured legal values (retail unit codes)
- Descriptions for each code
- Stickiness enabled
- Sort order 6

To add more retail units, update the migration or add legal values via the Unleash UI:
1. Go to Context Fields
2. Select "retailUnit"
3. Add new legal values with code and description

## Implementation Files

### Backend
- **Strategy Definition**: `/src/migrations/retail-unit-rollout-strategy.json`
- **Migration**: `/src/migrations/20260108044641-retail-unit-rollout-strategy.js`
- **Strategy Logic**: `/src/lib/features/playground/feature-evaluator/strategy/retail-unit-rollout-strategy.ts`
- **Strategy Registration**: `/src/lib/features/playground/feature-evaluator/strategy/index.ts`
- **Context Field Migration**: `/src/migrations/20260108044642-add-retail-unit-context-field.js` (includes 30 legal values)
- **Strategy Unit Tests**: `/src/lib/features/playground/feature-evaluator/strategy/retail-unit-rollout-strategy.test.ts`
- **E2E Tests**: `/src/test/e2e/api/admin/strategy.e2e.test.ts` (updated)

### Frontend
- **Strategy UI Component**: `/frontend/src/component/feature/StrategyTypes/RetailUnitRolloutStrategy/RetailUnitRolloutStrategy.tsx`
- **Component Tests**: `/frontend/src/component/feature/StrategyTypes/RetailUnitRolloutStrategy/RetailUnitRolloutStrategy.test.tsx`
- **Feature Strategy Integration**: `/frontend/src/component/feature/FeatureStrategy/FeatureStrategyType/FeatureStrategyType.tsx`
- **Release Plan Integration**: `/frontend/src/component/releases/ReleasePlanTemplate/TemplateForm/MilestoneStrategy/MilestoneStrategyTypeRetailUnit.tsx`
- **Strategy Names**: `/frontend/src/utils/strategyNames.tsx`

## Running Migrations

After pulling these changes, run the database migrations:

```bash
npm run db:migrate
```

This will:
1. Add the `retailUnitRollout` strategy to the strategies table
2. Add the `retailUnit` context field to context_fields table

## Testing

Test the strategy using the Unleash playground:

1. Go to a feature flag
2. Click "Playground"
3. Add `retailUnit` to the context properties
4. Verify the strategy evaluates correctly

### Running Unit Tests

```bash
# Backend strategy tests
npm test -- retail-unit-rollout-strategy.test

# Frontend component tests
npm test -- RetailUnitRolloutStrategy.test
```

### Running E2E Tests

```bash
npm run test:e2e -- strategy.e2e.test
```

The tests verify:
- Strategy evaluation logic for different retail units
- Gradual rollout with stickiness
- Case-insensitive matching
- Required parameters validation
- UI component behavior
- API endpoint responses

## Notes

- Retail unit codes are case-insensitive (SE = se)
- The strategy requires the `retailUnit` field in the context
- Uses the same normalization algorithm as flexible rollout for consistency
