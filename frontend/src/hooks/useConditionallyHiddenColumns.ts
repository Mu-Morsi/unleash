import { useEffect, useMemo } from 'react';

interface IConditionallyHiddenColumns {
    condition: boolean;
    columns: string[];
}

export const useConditionallyHiddenColumns = (
    conditionallyHiddenColumns: IConditionallyHiddenColumns[],
    setHiddenColumns: (
        columns: string[] | ((columns: string[]) => string[]),
    ) => void,
    columnsDefinition: unknown[],
) => {
    // INGKA Fork: Serialize columnsDefinition to avoid infinite loop when array reference changes
    const columnsDefinitionKey = useMemo(
        () => JSON.stringify(columnsDefinition.map((c) => (c as { id?: string })?.id)),
        [columnsDefinition],
    );

    useEffect(() => {
        const columnsToHide = conditionallyHiddenColumns
            .filter(({ condition }) => condition)
            .flatMap(({ columns }) => columns);

        const columnsToShow = conditionallyHiddenColumns
            .flatMap(({ columns }) => columns)
            .filter((column) => !columnsToHide.includes(column));

        setHiddenColumns((columns) => [
            ...new Set(
                [...columns, ...columnsToHide].filter(
                    (column) => !columnsToShow.includes(column),
                ),
            ),
        ]);
    }, [
        ...conditionallyHiddenColumns.map(({ condition }) => condition),
        setHiddenColumns,
        columnsDefinitionKey,
    ]);
};
