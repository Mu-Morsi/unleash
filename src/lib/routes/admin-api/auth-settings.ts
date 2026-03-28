import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { ADMIN, NONE } from '../../types/permissions.js';

export default class AuthSettingsController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('/simple/settings', this.getSimpleSettings, NONE);
        this.post('/simple/settings', this.updateSimpleSettings, ADMIN);
        this.get('/oidc/settings', this.getOidcSettings, NONE);
        this.post('/oidc/settings', this.updateOidcSettings, ADMIN);
        this.get('/saml/settings', this.getSamlSettings, NONE);
        this.post('/saml/settings', this.updateSamlSettings, ADMIN);
    }

    async getSimpleSettings(req: Request, res: Response): Promise<void> {
        res.json({ disabled: false });
    }

    async updateSimpleSettings(req: Request, res: Response): Promise<void> {
        res.json({ disabled: req.body.disabled ?? false });
    }

    async getOidcSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: false });
    }

    async updateOidcSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: req.body.enabled ?? false });
    }

    async getSamlSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: false });
    }

    async updateSamlSettings(req: Request, res: Response): Promise<void> {
        res.json({ enabled: req.body.enabled ?? false });
    }
}
