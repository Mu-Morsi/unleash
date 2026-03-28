export type ImpactMetricsConfig = {
    id: string;
    feature?: string;
    config: {
        metricName: string;
        title?: string;
        timeRange: string;
        aggregationMode: string;
        labelSelectors: Record<string, string[]>;
        yAxisMin: string;
    };
};

export type CreateImpactMetricsConfig = {
    id?: string;
    metricName: string;
    title?: string;
    timeRange: string;
    aggregationMode: string;
    labelSelectors: Record<string, string[]>;
    yAxisMin: string;
};

export type ImpactMetricsMetadata = {
    series: Record<string, { type: string; help: string; displayName: string }>;
};

export type ImpactMetricsDataPoint = {
    timestamp: string;
    value: number;
    labels: Record<string, string>;
};

export type ImpactMetricsData = {
    name: string;
    dataPoints: ImpactMetricsDataPoint[];
};

export type ImpactMetricsSeries = {
    metric: Record<string, string>;
    data: [number, number][];
};

export type ImpactMetricsQueryParams = {
    series: string;
    range: 'hour' | 'day' | 'week' | 'month';
    aggregationMode?: string;
    labels?: Record<string, string[]>;
};

export type ImpactMetricsResponse = {
    start?: string;
    end?: string;
    step?: string;
    series: ImpactMetricsSeries[];
    labels?: Record<string, string[]>;
    debug?: {
        query?: string;
        isTruncated?: string;
    };
};

export interface IImpactMetricsReadModel {
    getConfigs(): Promise<{ configs: ImpactMetricsConfig[] }>;
    getMetadata(): Promise<ImpactMetricsMetadata>;
    getImpactMetrics(params: ImpactMetricsQueryParams): Promise<ImpactMetricsResponse>;
    getPlausible(): Promise<{ data: unknown[] }>;
    createConfig(config: CreateImpactMetricsConfig): Promise<ImpactMetricsConfig>;
    deleteConfig(id: string): Promise<void>;
}
