type SearchParams = {
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

export interface IChangeRequestSearchStore {
    searchChangeRequests(
        params: SearchParams,
    ): Promise<{
        changeRequests: ChangeRequestSearchItem[];
        total: number;
    }>;
}
