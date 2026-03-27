import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import type { IChangeRequestEnvironmentConfig } from 'component/changeRequest/changeRequest.types';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

export const useChangeRequestConfig = (projectId: string) => {
    // INGKA Fork: Removed isEnterprise() check to enable change requests in OSS
    const { data, error, mutate } = useConditionalSWR<
        IChangeRequestEnvironmentConfig[]
    >(
        Boolean(projectId),
        [],
        formatApiPath(`api/admin/projects/${projectId}/change-requests/config`),
        fetcher,
    );
    return {
        data: data || [],
        loading: !error && !data,
        refetchChangeRequestConfig: mutate,
        error,
    };
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Request changes'))
        .then((res) => res.json());
};
