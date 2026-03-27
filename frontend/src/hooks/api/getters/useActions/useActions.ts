import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { IActionSet } from 'interfaces/action';
import { useUiFlag } from 'hooks/useUiFlag';

const DEFAULT_DATA = {
    actions: [],
};

export const useActions = (project: string) => {
    // INGKA Fork: Removed isEnterprise() check to enable actions in OSS
    const actionsEnabled = useUiFlag('automatedActions');

    const { data, error, mutate } = useConditionalSWR<{
        actions: IActionSet[];
    }>(
        actionsEnabled,
        DEFAULT_DATA,
        formatApiPath(`api/admin/projects/${project}/actions`),
        fetcher,
    );

    return useMemo(
        () => ({
            actions: data?.actions ?? [],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Actions'))
        .then((res) => res.json());
};
