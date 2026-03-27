import type { ILoginEvent } from 'interfaces/loginEvent';
import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

export const useLoginHistory = () => {
    // INGKA Fork: Removed isEnterprise() check to enable login history in OSS

    const { data, error, mutate } = useConditionalSWR(
        true,
        { events: [] },
        formatApiPath(`api/admin/logins`),
        fetcher,
    );

    return useMemo(
        () => ({
            events: (data?.events ?? []) as ILoginEvent[],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Login History'))
        .then((res) => res.json());
};
