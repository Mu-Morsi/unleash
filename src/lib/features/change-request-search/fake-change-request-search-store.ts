import type { IChangeRequestSearchStore } from './change-request-search-store-type.js';

export default class FakeChangeRequestSearchStore
    implements IChangeRequestSearchStore
{
    async searchChangeRequests(): Promise<{
        changeRequests: any[];
        total: number;
    }> {
        // INGKA Fork: Return empty results as change requests are an enterprise feature
        // This prevents 404s in the OSS fork while maintaining the API contract
        return {
            changeRequests: [],
            total: 0,
        };
    }
}
