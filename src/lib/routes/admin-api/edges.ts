// INGKA Fork: Connected edges endpoint for OSS
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { Request, Response } from 'express';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class EdgesController extends Controller {
    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
    ) {
        super(config);
        this.get('/', this.getEdges, NONE);
    }

    async getEdges(_req: Request, res: Response): Promise<void> {
        // Return empty connected edges list for OSS
        res.status(200).json([]);
    }
}
