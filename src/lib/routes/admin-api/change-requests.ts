import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class ChangeRequestsController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getChangeRequests, NONE);
        this.get('/config', this.getConfig, NONE);
        this.get('/actionable', this.getActionable, NONE);
        this.get('/scheduled', this.getScheduled, NONE);
        this.get('/pending', this.getPending, NONE);
        this.get('/pending/:featureName', this.getPendingByFeature, NONE);
        this.get('/count', this.getCount, NONE);
    }

    async getChangeRequests(req: Request, res: Response): Promise<void> {
        res.json([]);
    }

    async getConfig(req: Request, res: Response): Promise<void> {
        res.json([]);
    }

    async getActionable(req: Request, res: Response): Promise<void> {
        res.json({ total: 0 });
    }

    async getScheduled(req: Request, res: Response): Promise<void> {
        res.json([]);
    }

    async getPending(req: Request, res: Response): Promise<void> {
        res.json([]);
    }

    async getPendingByFeature(req: Request, res: Response): Promise<void> {
        res.json([]);
    }

    async getCount(req: Request, res: Response): Promise<void> {
        res.json({
            applied: 0,
            approved: 0,
            rejected: 0,
            scheduled: 0,
            reviewRequired: 0,
            total: 0,
        });
    }
}
