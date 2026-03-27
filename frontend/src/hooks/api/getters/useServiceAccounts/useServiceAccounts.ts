import type { IRole } from 'interfaces/role';
import type { IServiceAccount } from 'interfaces/service-account';
import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

export const useServiceAccounts = () => {
    // INGKA Fork: Removed isEnterprise() check to enable service accounts in OSS
    const { data, error, mutate } = useConditionalSWR(
        true,
        { serviceAccounts: [], rootRoles: [] },
        formatApiPath(`api/admin/service-account`),
        fetcher,
    );

    return useMemo(
        () => ({
            serviceAccounts: (data?.serviceAccounts ?? []) as IServiceAccount[],
            roles: (data?.rootRoles ?? []) as IRole[],
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Service Accounts'))
        .then((res) => res.json());
};
