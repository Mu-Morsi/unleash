import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { NONE } from '../../types/permissions.js';

export default class LicenseController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getLicense, NONE);
        this.get('/check', this.checkLicense, NONE);
    }

    async getLicense(req: Request, res: Response): Promise<void> {
        res.json({
            token: 'ingka-fork-oss-license',
            customer: 'INGKA',
            instanceName: 'Unleash OSS Fork',
            plan: 'Enterprise',
            resources: { seats: 999999, releaseTemplates: 999999, edgeInstances: 999999 },
            expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
    }

    async checkLicense(req: Request, res: Response): Promise<void> {
        res.json({ isValid: true, message: 'Enterprise features enabled', messageType: 'info' });
    }
}
