import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { ADMIN, NONE } from '../../types/permissions.js';

type Banner = {
    id: number;
    enabled: boolean;
    message: string;
    variant?: 'info' | 'warning' | 'error' | 'success';
    sticky?: boolean;
    icon?: string;
    link?: string;
    linkText?: string;
    dialogTitle?: string;
    dialog?: string;
    createdAt: string;
};

const bannersStore: Banner[] = [];

export default class BannersController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getBanners, NONE);
        this.post('', this.createBanner, ADMIN);
        this.put('/:id', this.updateBanner, ADMIN);
        this.delete('/:id', this.deleteBanner, ADMIN);
    }

    async getBanners(req: Request, res: Response): Promise<void> {
        res.json({ banners: bannersStore.filter(b => b.enabled) });
    }

    async createBanner(req: Request, res: Response): Promise<void> {
        const banner: Banner = {
            id: Date.now(),
            enabled: req.body.enabled ?? true,
            message: req.body.message || '',
            variant: req.body.variant || 'info',
            sticky: req.body.sticky || false,
            icon: req.body.icon,
            link: req.body.link,
            linkText: req.body.linkText,
            dialogTitle: req.body.dialogTitle,
            dialog: req.body.dialog,
            createdAt: new Date().toISOString(),
        };
        bannersStore.push(banner);
        res.status(201).json(banner);
    }

    async updateBanner(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const index = bannersStore.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).json({ message: 'Banner not found' });
            return;
        }
        bannersStore[index] = { ...bannersStore[index], ...req.body, id };
        res.json(bannersStore[index]);
    }

    async deleteBanner(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const index = bannersStore.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).json({ message: 'Banner not found' });
            return;
        }
        bannersStore.splice(index, 1);
        res.json({});
    }
}
