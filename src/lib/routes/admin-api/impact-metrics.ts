// INGKA Fork: Controller for impact-metrics endpoints
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import type { Request, Response } from 'express';
import { NONE } from '../../types/permissions.js';
import type { ImpactMetricsReadModel } from '../../features/metrics/impact/impact-metrics-read-model.js';

export class ImpactMetricsController extends Controller {
    private readModel: ImpactMetricsReadModel;

    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
        readModel: ImpactMetricsReadModel,
    ) {
        super(config);
        this.readModel = readModel;

        this.route({
            method: 'get',
            path: '/config',
            handler: this.getConfig.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'get',
            path: '/metadata',
            handler: this.getMetadata.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'get',
            path: '/',
            handler: this.getImpactMetrics.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'get',
            path: '/plausible',
            handler: this.getPlausible.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'post',
            path: '/config',
            handler: this.createConfig.bind(this),
            permission: NONE,
        });

        this.route({
            method: 'delete',
            path: '/config/:id',
            handler: this.deleteConfig.bind(this),
            permission: NONE,
        });
    }

    async getConfig(_req: Request, res: Response): Promise<void> {
        const result = await this.readModel.getConfigs();
        res.json(result);
    }

    async getMetadata(_req: Request, res: Response): Promise<void> {
        const result = await this.readModel.getMetadata();
        res.json(result);
    }

    async getImpactMetrics(req: Request, res: Response): Promise<void> {
        const series = req.query.series as string;
        const range = (req.query.range as 'hour' | 'day' | 'week' | 'month') || 'day';
        const aggregationMode = req.query.aggregationMode as string | undefined;
        const labelsParam = req.query.labels as string | undefined;
        const labels = labelsParam ? JSON.parse(labelsParam) : undefined;

        const result = await this.readModel.getImpactMetrics({ series, range, aggregationMode, labels });
        res.json(result);
    }

    async getPlausible(_req: Request, res: Response): Promise<void> {
        const result = await this.readModel.getPlausible();
        res.json(result);
    }

    async createConfig(req: Request, res: Response): Promise<void> {
        const config = await this.readModel.createConfig(req.body);
        res.status(201).json(config);
    }

    async deleteConfig(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await this.readModel.deleteConfig(id);
        res.status(204).send();
    }
}
