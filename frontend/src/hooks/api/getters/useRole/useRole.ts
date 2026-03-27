import type { SWRConfiguration } from 'swr';
import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import type { IRoleWithPermissions } from 'interfaces/role';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

export interface IUseRoleOutput {
    role?: IRoleWithPermissions;
    refetch: () => void;
    loading: boolean;
    error?: Error;
}

export const useRole = (
    id?: string,
    options: SWRConfiguration = {},
): IUseRoleOutput => {
    // INGKA Fork: Removed isEnterprise() check to enable role fetching for all users
    const { data, error, mutate } = useConditionalSWR(
        Boolean(id), // Only require id - enterprise restriction removed
        undefined,
        formatApiPath(`api/admin/roles/${id}`),
        fetcher,
        options,
    );

    return useMemo(
        () => ({
            role: data as IRoleWithPermissions,
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Role'))
        .then((res) => res.json());
};
