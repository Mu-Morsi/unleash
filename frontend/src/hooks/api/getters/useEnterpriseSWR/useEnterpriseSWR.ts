import type { BareFetcher, Key, SWRConfiguration } from 'swr';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';

// INGKA Fork: Removed isEnterprise() check to enable enterprise features in OSS
export const useEnterpriseSWR = <Data = any, Error = any>(
    fallback: Data,
    key: Key,
    fetcher: BareFetcher<Data>,
    options: SWRConfiguration = {},
) => {
    const result = useConditionalSWR<Data, Error>(
        true,
        fallback,
        key,
        fetcher,
        options,
    );

    return result;
};
