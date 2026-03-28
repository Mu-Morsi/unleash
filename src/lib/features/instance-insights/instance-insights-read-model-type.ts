export type UserTrend = {
    date: string;
    total: number;
    active: number;
    inactive: number;
};

export type FlagTrend = {
    date: string;
    total: number;
    stale: number;
    potentiallyStale: number;
    active: number;
};

export type ProjectFlagTrend = {
    date: string;
    project: string;
    total: number;
    stale: number;
    potentiallyStale: number;
    active: number;
    health: number;
};

export type MetricsSummaryTrend = {
    date: string;
    project: string;
    totalYes: number;
    totalNo: number;
    totalApps: number;
    totalFlags: number;
    totalEnvironments: number;
};

export type EnvironmentTypeTrend = {
    date: string;
    environmentType: string;
    totalUpdates: number;
};

export type LifecycleTrend = {
    date: string;
    stage: string;
    count: number;
};

export type CreationArchiveTrend = {
    date: string;
    project: string;
    createdFlags: { total: number; byType: Record<string, number> };
    archivedFlags: number;
};

export type InstanceInsights = {
    userTrends: UserTrend[];
    flagTrends: FlagTrend[];
    projectFlagTrends: ProjectFlagTrend[];
    metricsSummaryTrends: MetricsSummaryTrend[];
    environmentTypeTrends: EnvironmentTypeTrend[];
    lifecycleTrends: LifecycleTrend[];
    creationArchiveTrends: CreationArchiveTrend[];
};

export type LifecycleInsights = {
    lifecycleTrends: {
        cleanup: LifecycleStageTrend;
        develop: LifecycleStageTrend;
        production: LifecycleStageTrend;
    };
};

export type LifecycleStageTrend = {
    categories: {
        experimental: { flagsOlderThanWeek: number; newFlagsThisWeek: number };
        permanent: { flagsOlderThanWeek: number; newFlagsThisWeek: number };
        release: { flagsOlderThanWeek: number; newFlagsThisWeek: number };
    };
    medianDaysHistorically: number;
    medianDaysInCurrentStage: number;
    totalFlags: number;
};

export interface IInstanceInsightsReadModel {
    getUserTrends(from: string, to: string): Promise<UserTrend[]>;
    getFlagTrends(from: string, to: string): Promise<FlagTrend[]>;
    getProjectFlagTrends(from: string, to: string): Promise<ProjectFlagTrend[]>;
    getMetricsSummaryTrends(from: string, to: string): Promise<MetricsSummaryTrend[]>;
    getEnvironmentTypeTrends(from: string, to: string): Promise<EnvironmentTypeTrend[]>;
    getLifecycleTrends(from: string, to: string): Promise<LifecycleTrend[]>;
    getCreationArchiveTrends(from: string, to: string): Promise<CreationArchiveTrend[]>;
    getLifecycleInsights(): Promise<LifecycleInsights>;
}
