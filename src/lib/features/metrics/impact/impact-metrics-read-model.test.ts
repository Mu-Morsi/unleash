import { ImpactMetricsReadModel } from './impact-metrics-read-model.js';
import dbInit, { type ITestDb } from '../../../../test/e2e/helpers/database-init.js';
import getLogger from '../../../../test/fixtures/no-logger.js';

let db: ITestDb;
let readModel: ImpactMetricsReadModel;

beforeAll(async () => {
    db = await dbInit('impact_metrics_read_model', getLogger);
    readModel = new ImpactMetricsReadModel(db.rawDatabase);
});

afterAll(async () => {
    if (db) {
        await db.destroy();
    }
});

describe('ImpactMetricsReadModel', () => {
    test('getConfigs returns empty when table does not exist', async () => {
        const result = await readModel.getConfigs();
        expect(result).toEqual({ configs: [] });
    });

    test('getMetadata returns sample metrics', async () => {
        const result = await readModel.getMetadata();
        expect(result.series).toBeDefined();
        expect(Object.keys(result.series).length).toBeGreaterThan(0);
    });

    test('getImpactMetrics returns response with labels', async () => {
        const result = await readModel.getImpactMetrics({ series: 'test', range: 'day' });
        expect(result.series).toBeDefined();
        expect(result.labels).toBeDefined();
        expect(result.start).toBeDefined();
        expect(result.end).toBeDefined();
    });

    test('getPlausible returns empty array', async () => {
        const result = await readModel.getPlausible();
        expect(result).toEqual({ data: [] });
    });
});
