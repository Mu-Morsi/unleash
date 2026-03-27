import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { IInternalBanner } from 'interfaces/banner';

const ENDPOINT = 'api/admin/banners';

export const useBanners = () => {
    // INGKA Fork: Removed isEnterprise() check to enable banners in OSS

    const { data, error, mutate } = useConditionalSWR(
        true,
        { banners: [] },
        formatApiPath(ENDPOINT),
        fetcher,
    );

    return useMemo(
        () => ({
            banners: (data?.banners ?? []) as IInternalBanner[],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Banners'))
        .then((res) => res.json());
};
