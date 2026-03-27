import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { IReleasePlanTemplate } from 'interfaces/releasePlans';

const ENDPOINT = 'api/admin/release-plan-templates';

const DEFAULT_DATA: IReleasePlanTemplate[] = [];

export const useReleasePlanTemplates = () => {
    // INGKA Fork: Removed isEnterprise() check to enable release templates in OSS

    const { data, error, mutate } = useConditionalSWR<IReleasePlanTemplate[]>(
        true,
        DEFAULT_DATA,
        formatApiPath(ENDPOINT),
        fetcher,
    );

    return useMemo(
        () => ({
            templates: data ?? [],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Release templates'))
        .then((res) => res.json());
};
