// INGKA Fork: Project actions controller for OSS
import type { IUnleashConfig } from '../../../types/option.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { Request, Response } from 'express';
import Controller from '../../controller.js';
import { NONE } from '../../../types/permissions.js';

export default class ProjectActionsController extends Controller {
    constructor(
        config: IUnleashConfig,
        _services: Pick<IUnleashServices, 'openApiService'>,
    ) {
        super(config);
        this.get('/', this.getProjectActions, NONE);
        this.post('/', this.createProjectAction, NONE);
        this.get('/config', this.getProjectActionsConfig, NONE);
        this.get('/:actionId', this.getProjectAction, NONE);
        this.put('/:actionId', this.updateProjectAction, NONE);
        this.delete('/:actionId', this.deleteProjectAction, NONE);
        this.get('/:actionId/events', this.getProjectActionEvents, NONE);
    }

    async getProjectActions(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ actions: [] });
    }

    async createProjectAction(req: Request, res: Response): Promise<void> {
        const id = Date.now();
        res.status(201).json({
            id,
            name: req.body.name || 'New Action',
            enabled: true,
            ...req.body,
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async getProjectActionsConfig(_req: Request, res: Response): Promise<void> {
        res.status(200).json({
            actions: [],
            availableActors: [],
        });
    }

    async getProjectAction(req: Request, res: Response): Promise<void> {
        const { actionId } = req.params;
        res.status(200).json({
            id: Number(actionId),
            name: 'Action',
            enabled: true,
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async updateProjectAction(req: Request, res: Response): Promise<void> {
        const { actionId } = req.params;
        res.status(200).json({
            id: Number(actionId),
            ...req.body,
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
        });
    }

    async deleteProjectAction(_req: Request, res: Response): Promise<void> {
        res.status(204).send();
    }

    async getProjectActionEvents(_req: Request, res: Response): Promise<void> {
        res.status(200).json({ actionSetEvents: [] });
    }
}
