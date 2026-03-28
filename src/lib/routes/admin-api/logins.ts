// INGKA Fork: Login history endpoint for OSS
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { Request, Response } from 'express';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class LoginsController extends Controller {
    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
    ) {
        super(config);
        this.get('/', this.getLogins, NONE);
    }

    async getLogins(_req: Request, res: Response): Promise<void> {
        // Return empty login history for OSS
        res.status(200).json({ events: [] });
    }
}
