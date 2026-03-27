import type { IPersonalAPIToken } from 'interfaces/personalAPIToken';
import type { PatsSchema } from 'openapi';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

export interface IUseServiceAccountTokensOutput {
    tokens?: IPersonalAPIToken[];
    refetchTokens: () => void;
    loading: boolean;
    error?: Error;
}

export const useServiceAccountTokens = (
    id: number,
): IUseServiceAccountTokensOutput => {
    // INGKA Fork: Removed isEnterprise() check to enable service accounts in OSS
    const { data, error, mutate } = useConditionalSWR<PatsSchema>(
        true,
        { pats: [] },
        formatApiPath(`api/admin/service-account/${id}/token`),
        fetcher,
    );

    return {
        // FIXME: schema issue
        tokens: data ? (data.pats as any) : undefined,
        loading: !error && !data,
        refetchTokens: () => mutate(),
        error,
    };
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Service Account Tokens'))
        .then((res) => res.json());
};
