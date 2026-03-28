import { Box, styled } from '@mui/material';
import { StickinessSelect } from 'component/feature/StrategyTypes/FlexibleStrategy/StickinessSelect/StickinessSelect';
import ConditionalRolloutSlider from '../../../../feature/StrategyTypes/RolloutSlider/ConditionalRolloutSlider';
import type { IFormErrors } from 'hooks/useFormErrors';
import type { IFeatureStrategyParameters } from 'interfaces/strategy';
import { useEffect } from 'react';
import {
    parseParameterNumber,
    parseParameterString,
} from 'utils/parseParameter';
import Input from 'component/common/Input/Input';
import { HelpIcon } from 'component/common/HelpIcon/HelpIcon';

interface IMilestoneStrategyTypeRetailUnitProps {
    parameters: IFeatureStrategyParameters;
    updateParameter: (field: string, value: string) => void;
    editable: boolean;
    errors: IFormErrors;
}

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.elevation1,
    padding: theme.spacing(2),
    borderRadius: `${theme.shape.borderRadiusMedium}px`,
}));

const StyledOuterBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
}));

const StyledInnerBox1 = styled(Box)(({ theme }) => ({
    width: '50%',
    marginRight: theme.spacing(0.5),
}));

const StyledInnerBox2 = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '50%',
    marginLeft: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    '& > div': {
        flex: 1,
    },
}));

const StyledRetailUnitsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
}));

const DEFAULT_STICKINESS = 'default';

export const MilestoneStrategyTypeRetailUnit = ({
    parameters,
    updateParameter,
    editable,
    errors,
}: IMilestoneStrategyTypeRetailUnitProps) => {
    const updateRollout = (_e: Event, value: number | number[]) => {
        updateParameter('rollout', String(value));
    };

    const rollout = parseParameterNumber(parameters.rollout) || 100;
    const stickiness =
        parseParameterString(parameters.stickiness) || DEFAULT_STICKINESS;
    const groupId = parseParameterString(parameters.groupId) || '';
    const retailUnits = parseParameterString(parameters.retailUnits) || '';

    useEffect(() => {
        if (!parameters.stickiness) {
            updateParameter('stickiness', DEFAULT_STICKINESS);
        }
    }, []);

    return (
        <StyledBox>
            <StyledRetailUnitsBox>
                <Input
                    label='Retail Units'
                    id='retail-units-input'
                    value={retailUnits}
                    onChange={(e) =>
                        updateParameter('retailUnits', e.target.value)
                    }
                    disabled={!editable}
                    error={Boolean(errors.getFormError('retailUnits'))}
                    errorText={errors.getFormError('retailUnits')}
                    placeholder='SE, FR, US, DE'
                    required
                    sx={{ flex: 1 }}
                />
                <HelpIcon
                    tooltip='Comma-separated list of retail unit codes (country codes). Examples: SE, FR, US, DE, NO'
                />
            </StyledRetailUnitsBox>

            <ConditionalRolloutSlider
                name='Rollout'
                value={rollout}
                onChange={updateRollout}
                disabled={!editable}
            />

            <StyledOuterBox>
                <StyledInnerBox1>
                    <StickinessSelect
                        label='Stickiness'
                        value={stickiness}
                        editable={editable}
                        onChange={(e) =>
                            updateParameter('stickiness', e.target.value)
                        }
                    />
                </StyledInnerBox1>

                <StyledInnerBox2>
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
                </StyledInnerBox2>
            </StyledOuterBox>
        </StyledBox>
    );
};
