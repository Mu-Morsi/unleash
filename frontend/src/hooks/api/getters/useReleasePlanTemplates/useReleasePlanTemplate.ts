import { useMemo } from 'react';
import { formatApiPath } from 'utils/formatPath';
import handleErrorResponses from '../httpErrorResponseHandler.js';
import { useConditionalSWR } from '../useConditionalSWR/useConditionalSWR.js';
import type { IReleasePlanTemplate } from 'interfaces/releasePlans';

const path = (templateId: string) =>
    `api/admin/release-plan-templates/${templateId}`;

const DEFAULT_DATA: IReleasePlanTemplate = {
    id: '',
    name: '',
    description: '',
    milestones: [],
    createdAt: '',
    createdByUserId: 0,
};

export const useReleasePlanTemplate = (templateId: string) => {
    // INGKA Fork: Removed isEnterprise() check to enable release templates in OSS

    const { data, error, mutate } = useConditionalSWR<IReleasePlanTemplate>(
        true,
        DEFAULT_DATA,
        formatApiPath(path(templateId)),
        fetcher,
    );

    return useMemo(
        () => ({
            template: data ?? DEFAULT_DATA,
            loading: !error && !data,
            refetch: () => mutate(),
            error,
        }),
        [data, error, mutate],
    );
};

const fetcher = (path: string) => {
    return fetch(path)
        .then(handleErrorResponses('Release template'))
        .then((res) => res.json());
};
