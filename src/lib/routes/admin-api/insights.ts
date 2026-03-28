// INGKA Fork: Controller for insights endpoints
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import type { Request, Response } from 'express';
import { NONE } from '../../types/permissions.js';
import type { InstanceInsightsReadModel } from '../../features/instance-insights/instance-insights-read-model.js';

export class InsightsController extends Controller {
    private readModel: InstanceInsightsReadModel;

    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
        readModel: InstanceInsightsReadModel,
    ) {
        super(config);
        this.readModel = readModel;

        this.route({
            method: 'get',
            path: '',
            handler: this.getInsights.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'get',
            path: '/lifecycle',
            handler: this.getLifecycleInsights.bind(this),
            permission: NONE,
        });
    }

    async getInsights(req: Request, res: Response): Promise<void> {
        const from = (req.query.from as string) || '';
        const to = (req.query.to as string) || '';

        const [
            userTrends,
            flagTrends,
            projectFlagTrends,
            metricsSummaryTrends,
            environmentTypeTrends,
            lifecycleTrends,
            creationArchiveTrends,
        ] = await Promise.all([
            this.readModel.getUserTrends(from, to),
            this.readModel.getFlagTrends(from, to),
            this.readModel.getProjectFlagTrends(from, to),
            this.readModel.getMetricsSummaryTrends(from, to),
            this.readModel.getEnvironmentTypeTrends(from, to),
            this.readModel.getLifecycleTrends(from, to),
            this.readModel.getCreationArchiveTrends(from, to),
        ]);

        res.json({
            userTrends,
            flagTrends,
            projectFlagTrends,
            metricsSummaryTrends,
            environmentTypeTrends,
            lifecycleTrends,
            creationArchiveTrends,
        });
    }

    async getLifecycleInsights(_req: Request, res: Response): Promise<void> {
        const data = await this.readModel.getLifecycleInsights();
        res.json(data);
    }
}
