import type { IUnleashConfig } from '../../types/index.js';
import { ChangeRequestSearchService } from './change-request-search-service.js';
import FakeChangeRequestSearchStore from './fake-change-request-search-store.js';

export const createFakeChangeRequestSearchService = (
    config: IUnleashConfig,
): ChangeRequestSearchService => {
    const fakeChangeRequestSearchStore = new FakeChangeRequestSearchStore();

    return new ChangeRequestSearchService(
        {
            changeRequestSearchStore: fakeChangeRequestSearchStore,
        },
        config,
    );
};
