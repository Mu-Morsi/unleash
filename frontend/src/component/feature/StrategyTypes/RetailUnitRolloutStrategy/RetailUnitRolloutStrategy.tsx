import { useEffect } from 'react';
import { Autocomplete, Box, Checkbox, styled, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import type { IFeatureStrategyParameters } from 'interfaces/strategy';
import ConditionalRolloutSlider from '../RolloutSlider/ConditionalRolloutSlider';
import Input from 'component/common/Input/Input';
import {
    parseParameterNumber,
    parseParameterString,
    parseParameterStrings,
} from 'utils/parseParameter';
import { StickinessSelect } from '../FlexibleStrategy/StickinessSelect/StickinessSelect';
import type { IFormErrors } from 'hooks/useFormErrors';
import { HelpIcon } from 'component/common/HelpIcon/HelpIcon';
import type { IUnleashContextDefinition } from 'interfaces/context';

interface IRetailUnitRolloutStrategyProps {
    context: IUnleashContextDefinition[];
    parameters: IFeatureStrategyParameters;
    updateParameter: (field: string, value: string) => void;
    editable: boolean;
    errors: IFormErrors;
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.elevation1,
    padding: theme.spacing(2),
    borderRadius: `${theme.shape.borderRadiusMedium}px`,
}));

const StyledInputRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    '& > *': {
        flex: 1,
    },
}));

const StyledInputWithIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const DEFAULT_STICKINESS = 'default';

export const RetailUnitRolloutStrategy = ({
    context,
    parameters,
    updateParameter,
    editable,
    errors,
}: IRetailUnitRolloutStrategyProps) => {
    const rollout = parseParameterNumber(parameters.rollout) || 100;
    const stickiness = parseParameterString(parameters.stickiness) || DEFAULT_STICKINESS;
    const groupId = parseParameterString(parameters.groupId) || '';
    const retailUnitsParam = parseParameterString(parameters.retailUnits) || '';
    const retailUnitsArray = parseParameterStrings(parameters.retailUnits);

    // Get legal values for retailUnit context field
    const retailUnitContext = context.find(ctx => ctx.name === 'retailUnit');
    const retailUnitOptions = retailUnitContext?.legalValues?.map(lv => lv.value) || [];

    const updateRollout = (_e: Event, value: number | number[]) => {
        updateParameter('rollout', String(value));
    };

    const handleRetailUnitsChange = (_event: React.SyntheticEvent, value: string[]) => {
        updateParameter('retailUnits', value.join(','));
    };

    useEffect(() => {
        if (!parameters.stickiness) {
            updateParameter('stickiness', DEFAULT_STICKINESS);
        }
    }, []);

    return (
        <StyledBox>
            <Box>
                <StyledInputWithIcon>
                    <Autocomplete
                        multiple
                        id='retail-units-autocomplete'
                        options={retailUnitOptions}
                        value={retailUnitsArray}
                        onChange={handleRetailUnitsChange}
                        disabled={!editable}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option}
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                                    checkedIcon={<CheckBoxIcon fontSize='small' />}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {retailUnitContext?.legalValues?.find(lv => lv.value === option)?.description || option}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Retail Units'
                                placeholder='Select retail units'
                                error={Boolean(errors.getFormError('retailUnits'))}
                                helperText={errors.getFormError('retailUnits')}
                                required={retailUnitsArray.length === 0}
                            />
                        )}
                        sx={{ flex: 1 }}
                    />
                    <HelpIcon
                        tooltip='Select one or more retail unit codes (country codes) from the list. These are configured in the retailUnit context field.'
                    />
                </StyledInputWithIcon>
            </Box>

            <Box>
                <ConditionalRolloutSlider
                    name='Rollout'
                    value={rollout}
                    onChange={updateRollout}
                    disabled={!editable}
                />
            </Box>

            <StyledInputRow>
                <StickinessSelect
                    label='Stickiness'
                    value={stickiness}
                    editable={editable}
                    onChange={(e) =>
                        updateParameter('stickiness', e.target.value)
                    }
                />
                <StyledInputWithIcon>
                    <Input
                        label='GroupId'
                        id='groupId-input'
                        value={groupId}
                        onChange={(e) =>
                            updateParameter('groupId', e.target.value)
                        }
                        disabled={!editable}
                        error={Boolean(errors.getFormError('groupId'))}
                        errorText={errors.getFormError('groupId')}
                    />
                    <HelpIcon
                        tooltip='Used to correlate rollout across multiple feature flags'
                    />
                </StyledInputWithIcon>
            </StyledInputRow>
        </StyledBox>
    );
};
