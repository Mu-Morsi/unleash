import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class TrafficController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getTraffic, NONE);
    }

    async getTraffic(req: Request, res: Response): Promise<void> {
        const from = (req.query.from as string) || new Date().toISOString().split('T')[0];
        const to = (req.query.to as string) || new Date().toISOString().split('T')[0];
        const grouping = (req.query.grouping as string) || 'daily';
        res.json({
            apiData: [],
            dateRange: { from, to },
            grouping,
        });
    }
}
