import { formatApiPath } from 'utils/formatPath';
import { useMemo } from 'react';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { IProjectRoleUsageCount } from 'interfaces/project';

export const useProjectRoleAccessUsage = (roleId?: number) => {
    // INGKA Fork: Removed isEnterprise() check to enable project role access in OSS

    const { data, error, mutate } = useConditionalSWR(
        !!roleId,
        { projects: [] },
        formatApiPath(`api/admin/projects/roles/${roleId}/access`),
        fetcher,
    );

    return useMemo(
        () => ({
            projects: (data?.projects ?? []) as IProjectRoleUsageCount[],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Project role usage'))
        .then((res) => res.json());
};
