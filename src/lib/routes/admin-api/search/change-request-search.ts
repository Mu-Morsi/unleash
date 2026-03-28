import type { Response } from 'express';
import Controller from '../../controller.js';
import type { IUnleashConfig } from '../../../types/index.js';
import { NONE } from '../../../types/permissions.js';
import type { IUnleashServices } from '../../../services/index.js';
import type { IAuthRequest } from '../../unleash-types.js';
import type { ChangeRequestSearchService } from '../../../features/change-request-search/change-request-search-service.js';

type SearchChangeRequestsParams = {
    createdBy?: string;
    requestedApproverId?: string;
    state?: string;
    offset?: number;
    limit?: number;
};

type ChangeRequestSearchItem = {
    id: number;
    title?: string;
    state: string;
    createdAt: string;
    createdBy?: { id: number; username?: string };
    project: string;
};

type ChangeRequestSearchResponse = {
    changeRequests: ChangeRequestSearchItem[];
    total: number;
};

export class ChangeRequestSearchController extends Controller {
    private changeRequestSearchService: ChangeRequestSearchService;

    constructor(
        config: IUnleashConfig,
        {
            changeRequestSearchService,
        }: Pick<IUnleashServices, 'changeRequestSearchService'>,
    ) {
        super(config);
        this.changeRequestSearchService = changeRequestSearchService;

        this.route({
            method: 'get',
            path: '',
            handler: this.searchChangeRequests,
            permission: NONE,
        });
    }

    async searchChangeRequests(
        req: IAuthRequest<any, any, any, SearchChangeRequestsParams>,
        res: Response<ChangeRequestSearchResponse>,
    ): Promise<void> {
        const { query } = req;
        const result = await this.changeRequestSearchService.search(query);
        res.json(result);
    }
}
