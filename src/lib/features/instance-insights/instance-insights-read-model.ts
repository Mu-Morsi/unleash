import type { Db } from '../../db/db.js';
import type {
    IInstanceInsightsReadModel,
    UserTrend,
    FlagTrend,
    ProjectFlagTrend,
    MetricsSummaryTrend,
    EnvironmentTypeTrend,
    LifecycleTrend,
    CreationArchiveTrend,
    LifecycleInsights,
} from './instance-insights-read-model-type.js';

export class InstanceInsightsReadModel implements IInstanceInsightsReadModel {
    private db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getUserTrends(from: string, to: string): Promise<UserTrend[]> {
        try {
            const rows = await this.db('user_trends')
                .select('id as date', 'total_users as total', 'active_users as active')
                .whereBetween('created_at', [from, to])
                .orderBy('created_at', 'asc');

            return rows.map((row) => ({
                date: row.date,
                total: Number(row.total),
                active: Number(row.active),
                inactive: Number(row.total) - Number(row.active),
            }));
        } catch {
            return [];
        }
    }

    async getFlagTrends(from: string, to: string): Promise<FlagTrend[]> {
        try {
            const rows = await this.db('flag_trends')
                .select(
                    'id as date',
                    this.db.raw('SUM(total_flags) as total'),
                    this.db.raw('SUM(stale_flags) as stale'),
                    this.db.raw('SUM(potentially_stale_flags) as potentially_stale'),
                )
                .whereBetween('created_at', [from, to])
                .groupBy('id')
                .orderBy('id', 'asc');

            return rows.map((row) => ({
                date: row.date,
                total: Number(row.total),
                stale: Number(row.stale),
                potentiallyStale: Number(row.potentially_stale),
                active: Number(row.total) - Number(row.stale) - Number(row.potentially_stale),
            }));
        } catch {
            return [];
        }
    }

    async getProjectFlagTrends(from: string, to: string): Promise<ProjectFlagTrend[]> {
        try {
            const rows = await this.db('flag_trends')
                .select(
                    'id as date',
                    'project',
                    'total_flags as total',
                    'stale_flags as stale',
                    'potentially_stale_flags as potentially_stale',
                )
                .whereBetween('created_at', [from, to])
                .orderBy('id', 'asc');

            return rows.map((row) => {
                const total = Number(row.total);
                const stale = Number(row.stale);
                const potentiallyStale = Number(row.potentially_stale);
                const active = total - stale - potentiallyStale;
                const health = total > 0 ? Math.round((active / total) * 100) : 100;
                return { date: row.date, project: row.project, total, stale, potentiallyStale, active, health };
            });
        } catch {
            return [];
        }
    }

    async getMetricsSummaryTrends(from: string, to: string): Promise<MetricsSummaryTrend[]> {
        try {
            const rows = await this.db('project_client_metrics_trends')
                .select('date', 'project', 'total_yes', 'total_no', 'total_apps', 'total_flags', 'total_environments')
                .whereBetween('date', [from, to])
                .orderBy('date', 'asc');

            return rows.map((row) => ({
                date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
                project: row.project,
                totalYes: Number(row.total_yes),
                totalNo: Number(row.total_no),
                totalApps: Number(row.total_apps),
                totalFlags: Number(row.total_flags),
                totalEnvironments: Number(row.total_environments),
            }));
        } catch {
            return [];
        }
    }

    async getEnvironmentTypeTrends(from: string, to: string): Promise<EnvironmentTypeTrend[]> {
        try {
            const rows = await this.db('environment_type_trends')
                .select('id as date', 'environment_type', 'total_updates')
                .orderBy('id', 'asc');

            return rows
                .filter((row) => row.date >= from && row.date <= to)
                .map((row) => ({
                    date: row.date,
                    environmentType: row.environment_type,
                    totalUpdates: Number(row.total_updates),
                }));
        } catch {
            return [];
        }
    }

    async getLifecycleTrends(from: string, to: string): Promise<LifecycleTrend[]> {
        try {
            const rows = await this.db('events')
                .select(
                    this.db.raw("DATE_TRUNC('week', created_at)::date as date"),
                    this.db.raw("'production' as stage"),
                    this.db.raw('COUNT(*) as count'),
                )
                .where('type', 'feature-environment-enabled')
                .whereBetween('created_at', [from, to])
                .groupBy(this.db.raw("DATE_TRUNC('week', created_at)::date"))
                .orderBy('date', 'asc');

            return rows.map((row) => ({
                date: row.date instanceof Date ? row.date.toISOString() : String(row.date),
                stage: row.stage,
                count: Number(row.count),
            }));
        } catch {
            return [];
        }
    }

    async getCreationArchiveTrends(from: string, to: string): Promise<CreationArchiveTrend[]> {
        try {
            const createdRows = await this.db('events')
                .select(
                    this.db.raw("DATE_TRUNC('week', created_at)::date as date"),
                    'project',
                    this.db.raw('COUNT(*) as created_count'),
                )
                .where('type', 'feature-created')
                .whereBetween('created_at', [from, to])
                .groupBy(this.db.raw("DATE_TRUNC('week', created_at)::date"), 'project')
                .orderBy('date', 'asc');

            const archivedRows = await this.db('events')
                .select(
                    this.db.raw("DATE_TRUNC('week', created_at)::date as date"),
                    'project',
                    this.db.raw('COUNT(*) as archived_count'),
                )
                .where('type', 'feature-archived')
                .whereBetween('created_at', [from, to])
                .groupBy(this.db.raw("DATE_TRUNC('week', created_at)::date"), 'project')
                .orderBy('date', 'asc');

            const trendsMap = new Map<string, {
                date: string;
                project: string;
                createdFlags: { total: number; byType: Record<string, number> };
                archivedFlags: number;
            }>();

            for (const row of createdRows) {
                const key = `${row.date}-${row.project}`;
                const dateStr = row.date instanceof Date ? row.date.toISOString() : String(row.date);
                trendsMap.set(key, {
                    date: dateStr,
                    project: row.project || 'default',
                    createdFlags: { total: Number(row.created_count), byType: {} },
                    archivedFlags: 0,
                });
            }

            for (const row of archivedRows) {
                const key = `${row.date}-${row.project}`;
                const dateStr = row.date instanceof Date ? row.date.toISOString() : String(row.date);
                if (trendsMap.has(key)) {
                    trendsMap.get(key)!.archivedFlags = Number(row.archived_count);
                } else {
                    trendsMap.set(key, {
                        date: dateStr,
                        project: row.project || 'default',
                        createdFlags: { total: 0, byType: {} },
                        archivedFlags: Number(row.archived_count),
                    });
                }
            }

            return Array.from(trendsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
        } catch {
            return [];
        }
    }

    async getLifecycleInsights(): Promise<LifecycleInsights> {
        const empty = {
            categories: {
                experimental: { flagsOlderThanWeek: 0, newFlagsThisWeek: 0 },
                permanent: { flagsOlderThanWeek: 0, newFlagsThisWeek: 0 },
                release: { flagsOlderThanWeek: 0, newFlagsThisWeek: 0 },
            },
            medianDaysHistorically: 0,
            medianDaysInCurrentStage: 0,
            totalFlags: 0,
        };

        return {
            lifecycleTrends: {
                cleanup: { ...empty },
                develop: { ...empty },
                production: { ...empty },
            },
        };
    }
}

export function createInstanceInsightsReadModel(db: Db): InstanceInsightsReadModel {
    return new InstanceInsightsReadModel(db);
}
