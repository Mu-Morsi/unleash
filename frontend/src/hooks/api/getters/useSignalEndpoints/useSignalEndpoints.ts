import { useContext, useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { ISignalEndpoint } from 'interfaces/signal';
import { useUiFlag } from 'hooks/useUiFlag';
import AccessContext from 'contexts/AccessContext';

const ENDPOINT = 'api/admin/signal-endpoints';

const DEFAULT_DATA = {
    signalEndpoints: [],
};

export const useSignalEndpoints = () => {
    const { isAdmin } = useContext(AccessContext);
    // INGKA Fork: Removed isEnterprise() check to enable signals in OSS
    const signalsEnabled = useUiFlag('signals');

    const { data, error, mutate } = useConditionalSWR<{
        signalEndpoints: ISignalEndpoint[];
    }>(
        isAdmin && signalsEnabled,
        DEFAULT_DATA,
        formatApiPath(ENDPOINT),
        fetcher,
    );

    return useMemo(
        () => ({
            signalEndpoints: data?.signalEndpoints ?? [],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Signal endpoints'))
        .then((res) => res.json());
};
