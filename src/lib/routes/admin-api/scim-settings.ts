import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { ADMIN, NONE } from '../../types/permissions.js';

export default class ScimSettingsController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getSettings, NONE);
        this.post('', this.updateSettings, ADMIN);
        this.post('/generate-new-token', this.generateToken, ADMIN);
    }

    async getSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: false, hasToken: false });
    }

    async updateSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: req.body.enabled ?? false, hasToken: false });
    }

    async generateToken(req: Request, res: Response): Promise<void> {
        res.json({ token: `scim-token-${Date.now()}` });
    }
}
