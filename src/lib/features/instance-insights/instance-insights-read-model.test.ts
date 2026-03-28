import { InstanceInsightsReadModel } from './instance-insights-read-model.js';
import dbInit, { type ITestDb } from '../../../test/e2e/helpers/database-init.js';
import getLogger from '../../../test/fixtures/no-logger.js';

let db: ITestDb;
let readModel: InstanceInsightsReadModel;

beforeAll(async () => {
    db = await dbInit('instance_insights_read_model', getLogger);
    readModel = new InstanceInsightsReadModel(db.rawDatabase);
});

afterAll(async () => {
    if (db) {
        await db.destroy();
    }
});

describe('InstanceInsightsReadModel', () => {
    test('getUserTrends returns empty array when no data', async () => {
        const result = await readModel.getUserTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getFlagTrends returns empty array when no data', async () => {
        const result = await readModel.getFlagTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getProjectFlagTrends returns empty array when no data', async () => {
        const result = await readModel.getProjectFlagTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getMetricsSummaryTrends returns empty array when no data', async () => {
        const result = await readModel.getMetricsSummaryTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getEnvironmentTypeTrends returns empty array when no data', async () => {
        const result = await readModel.getEnvironmentTypeTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getLifecycleTrends returns empty array when no data', async () => {
        const result = await readModel.getLifecycleTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getCreationArchiveTrends returns empty array when no data', async () => {
        const result = await readModel.getCreationArchiveTrends('2025-01-01', '2025-12-31');
        expect(result).toEqual([]);
    });

    test('getLifecycleInsights returns default structure', async () => {
        const result = await readModel.getLifecycleInsights();
        expect(result).toHaveProperty('lifecycleTrends');
        expect(result.lifecycleTrends).toHaveProperty('cleanup');
        expect(result.lifecycleTrends).toHaveProperty('develop');
        expect(result.lifecycleTrends).toHaveProperty('production');
    });
});
