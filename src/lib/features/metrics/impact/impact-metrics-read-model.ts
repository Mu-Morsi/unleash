import type { Db } from '../../../db/db.js';
import type {
    IImpactMetricsReadModel,
    ImpactMetricsConfig,
    ImpactMetricsMetadata,
    ImpactMetricsQueryParams,
    ImpactMetricsResponse,
    CreateImpactMetricsConfig,
} from './impact-metrics-read-model-type.js';
import { randomId } from '../../../util/random-id.js';

export class ImpactMetricsReadModel implements IImpactMetricsReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getConfigs(): Promise<{ configs: ImpactMetricsConfig[] }> {
        try {
            const hasTable = await this.db.schema.hasTable('impact_metrics');
            if (!hasTable) {
                return { configs: [] };
            }

            const rows = await this.db('impact_metrics')
                .select('id', 'feature', 'config')
                .orderBy('id', 'asc');

            return {
                configs: rows.map((row) => ({
                    id: row.id,
                    feature: row.feature,
                    config: row.config,
                })),
            };
        } catch {
            return { configs: [] };
        }
    }

    async getMetadata(): Promise<ImpactMetricsMetadata> {
        // Return sample metrics when Prometheus is not configured
        // In production, this would fetch from the Prometheus API
        return {
            series: {
                unleash_frontend_api_request_total: {
                    type: 'counter',
                    help: 'Total number of frontend API requests',
                    displayName: 'Frontend API Requests',
                },
                unleash_client_register_total: {
                    type: 'counter',
                    help: 'Total number of client registrations',
                    displayName: 'Client Registrations',
                },
                unleash_feature_toggle_usage_total: {
                    type: 'counter',
                    help: 'Total feature toggle usage count',
                    displayName: 'Feature Toggle Usage',
                },
                unleash_db_pool_used: {
                    type: 'gauge',
                    help: 'Number of used database connections',
                    displayName: 'DB Pool Used',
                },
                unleash_db_pool_free: {
                    type: 'gauge',
                    help: 'Number of free database connections',
                    displayName: 'DB Pool Free',
                },
            },
        };
    }

    async getImpactMetrics(params: ImpactMetricsQueryParams): Promise<ImpactMetricsResponse> {
        // Calculate time range
        const now = new Date();
        const rangeMs = {
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
        };
        const start = new Date(now.getTime() - rangeMs[params.range]);

        // Return mock data with sample labels for development
        // In production, this would query Prometheus
        return {
            start: start.toISOString(),
            end: now.toISOString(),
            step: params.range === 'hour' ? '60s' : params.range === 'day' ? '300s' : '3600s',
            series: [],
            labels: {
                environment: ['development', 'production', 'staging'],
                appName: ['my-app', 'web-frontend', 'mobile-app'],
                origin: ['client', 'server'],
            },
            debug: {
                query: `${params.series}{range="${params.range}"}`,
            },
        };
    }

    async getPlausible(): Promise<{ data: unknown[] }> {
        return { data: [] };
    }

    async createConfig(input: CreateImpactMetricsConfig): Promise<ImpactMetricsConfig> {
        const id = input.id || randomId();
        const config = {
            metricName: input.metricName,
            title: input.title,
            timeRange: input.timeRange,
            aggregationMode: input.aggregationMode,
            labelSelectors: input.labelSelectors,
            yAxisMin: input.yAxisMin,
        };

        await this.db('impact_metrics')
            .insert({ id, config: JSON.stringify(config) })
            .onConflict('id')
            .merge({ config: JSON.stringify(config) });

        return { id, config };
    }

    async deleteConfig(id: string): Promise<void> {
        await this.db('impact_metrics').where('id', id).delete();
    }
}

export function createImpactMetricsReadModel(db: Db): ImpactMetricsReadModel {
    return new ImpactMetricsReadModel(db);
}
