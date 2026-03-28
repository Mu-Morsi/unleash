import type { Request, Response } from 'express';
import type { IUnleashConfig } from '../../types/option.js';
import type { IUnleashServices } from '../../services/index.js';
import Controller from '../controller.js';
import { ADMIN, NONE } from '../../types/permissions.js';

type ReleasePlanTemplate = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    createdByUserId: number;
    milestones: { id: string; name: string; sortOrder: number }[];
};

const templatesStore: ReleasePlanTemplate[] = [];

export default class ReleasePlanTemplatesController extends Controller {
    constructor(config: IUnleashConfig, services: Pick<IUnleashServices, 'openApiService'>) {
        super(config);
        this.get('', this.getTemplates, NONE);
        this.post('', this.createTemplate, ADMIN);
        this.get('/:id', this.getTemplate, NONE);
        this.put('/:id', this.updateTemplate, ADMIN);
        this.post('/archive/:id', this.archiveTemplate, ADMIN);
    }

    async getTemplates(req: Request, res: Response): Promise<void> {
        res.json(templatesStore);
    }

    async getTemplate(req: Request, res: Response): Promise<void> {
        const template = templatesStore.find(t => t.id === req.params.id);
        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        res.json(template);
    }

    async createTemplate(req: Request, res: Response): Promise<void> {
        const template: ReleasePlanTemplate = {
            id: crypto.randomUUID(),
            name: req.body.name || '',
            description: req.body.description || '',
            createdAt: new Date().toISOString(),
            createdByUserId: 1,
            milestones: req.body.milestones || [],
        };
        templatesStore.push(template);
        res.status(201).json(template);
    }

    async updateTemplate(req: Request, res: Response): Promise<void> {
        const index = templatesStore.findIndex(t => t.id === req.params.id);
        if (index === -1) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        templatesStore[index] = { ...templatesStore[index], ...req.body, id: req.params.id };
        res.json(templatesStore[index]);
    }

    async archiveTemplate(req: Request, res: Response): Promise<void> {
        const index = templatesStore.findIndex(t => t.id === req.params.id);
        if (index === -1) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        templatesStore.splice(index, 1);
        res.json({});
    }
}
