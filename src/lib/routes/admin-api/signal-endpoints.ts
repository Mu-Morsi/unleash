// INGKA Fork: Signal endpoints controller for OSS
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import type { Request, Response } from 'express';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class SignalEndpointsController extends Controller {
    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
    ) {
        super(config);
        this.get('/', this.getSignalEndpoints, NONE);
        this.post('/', this.createSignalEndpoint, NONE);
        this.get('/:signalEndpointId', this.getSignalEndpoint, NONE);
        this.put('/:signalEndpointId', this.updateSignalEndpoint, NONE);
        this.delete('/:signalEndpointId', this.deleteSignalEndpoint, NONE);
        this.get('/:signalEndpointId/signals', this.getSignalEndpointSignals, NONE);
    }

    async getSignalEndpoints(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ signalEndpoints: [] });
    }

    async createSignalEndpoint(req: Request, res: Response): Promise<void> {
        const id = Date.now();
        res.status(201).json({
            id,
            name: req.body.name || 'New Signal Endpoint',
            enabled: true,
            description: req.body.description || '',
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async getSignalEndpoint(req: Request, res: Response): Promise<void> {
        const { signalEndpointId } = req.params;
        res.status(200).json({
            id: Number(signalEndpointId),
            name: 'Signal Endpoint',
            enabled: true,
            description: '',
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async updateSignalEndpoint(req: Request, res: Response): Promise<void> {
        const { signalEndpointId } = req.params;
        res.status(200).json({
            id: Number(signalEndpointId),
            name: req.body.name || 'Signal Endpoint',
            enabled: req.body.enabled ?? true,
            description: req.body.description || '',
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async deleteSignalEndpoint(_req: Request, res: Response): Promise<void> {
        res.status(204).send();
    }

    async getSignalEndpointSignals(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ signalEndpointSignals: [] });
    }
}
