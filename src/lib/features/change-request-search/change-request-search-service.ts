import type { IUnleashConfig } from '../../types/index.js';
import type { IChangeRequestSearchStore } from './change-request-search-store-type.js';

type SearchParams = {
    createdBy?: string;
    requestedApproverId?: string;
    state?: string;
    offset?: number;
    limit?: number;
};

export class ChangeRequestSearchService {
    private changeRequestSearchStore: IChangeRequestSearchStore;

    constructor(
        { changeRequestSearchStore }: { changeRequestSearchStore: IChangeRequestSearchStore },
        _config: Pick<IUnleashConfig, 'getLogger'>,
    ) {
        this.changeRequestSearchStore = changeRequestSearchStore;
    }

    async search(params: SearchParams) {
        return this.changeRequestSearchStore.searchChangeRequests(params);
    }
}
