import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../types/option.js';
import type { IUnleashServices } from '../services/index.js';
import Controller from './controller.js';
import { NONE } from '../types/permissions.js';

export default class InstanceController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('/trafficBundles', this.getTrafficBundles, NONE);
    }

    async getTrafficBundles(req: Request, res: Response): Promise<void> {
        res.json({ includedTraffic: 999999999, purchasedTraffic: 0 });
    }
}
