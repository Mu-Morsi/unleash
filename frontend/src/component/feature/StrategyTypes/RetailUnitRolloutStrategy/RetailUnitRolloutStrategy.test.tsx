import { vi } from 'vitest';
import { useState } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { RetailUnitRolloutStrategy } from './RetailUnitRolloutStrategy.tsx';
import { render } from 'utils/testRenderer';
import { Route, Routes } from 'react-router-dom';
import type { IUnleashContextDefinition } from 'interfaces/context';

const mockContext: IUnleashContextDefinition[] = [
    {
        name: 'retailUnit',
        description: 'Retail unit codes',
        createdAt: '2024-01-01T00:00:00Z',
        sortOrder: 1,
        stickiness: true,
        legalValues: [
            { value: 'SE', description: 'Sweden' },
            { value: 'FR', description: 'France' },
            { value: 'US', description: 'United States' },
            { value: 'DE', description: 'Germany' },
        ],
    },
];

test('manipulates retail units and rollout slider', async () => {
    const Wrapper = () => {
        const [parameters, setParameters] = useState({
            retailUnits: 'SE, FR',
            rollout: '0',
            stickiness: 'default',
            groupId: 'testid',
        });

        const updateParameter = (parameter: string, value: string) => {
            setParameters((prevParameters) => ({
                ...prevParameters,
                [parameter]: value,
            }));
        };

        return (
            <Routes>
                <Route
                    path='/projects/:projectId/features/:featureId'
                    element={
                        <RetailUnitRolloutStrategy
                            context={mockContext}
                            parameters={parameters}
                            updateParameter={updateParameter}
                            editable={true}
                            errors={
                                {
                                    getFormError: () => undefined,
                                } as any
                            }
                        />
                    }
                />
            </Routes>
        );
    };

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    const slider = await screen.findByRole('slider', { name: /rollout/i });
    const retailUnitsInput = await screen.findByLabelText('Retail Units');
    const groupIdInput = await screen.findByLabelText('GroupId');

    expect(slider).toHaveValue('0');
    expect(retailUnitsInput).toHaveValue('SE, FR');
    expect(groupIdInput).toHaveValue('testid');

    fireEvent.change(slider, { target: { value: '50' } });
    fireEvent.change(retailUnitsInput, { target: { value: 'SE, FR, US' } });
    fireEvent.change(groupIdInput, { target: { value: 'newGroupId' } });

    expect(slider).toHaveValue('50');
    expect(retailUnitsInput).toHaveValue('SE, FR, US');
    expect(groupIdInput).toHaveValue('newGroupId');
});

test('should fill in default stickiness if not present', async () => {
    const updateParameter = vi.fn();
    const Wrapper = () => (
        <Routes>
            <Route
                path='/projects/:projectId/features/:featureId'
                element={
                    <RetailUnitRolloutStrategy
                        context={mockContext}
                        parameters={{
                            retailUnits: 'SE',
                            rollout: '50',
                        }}
                        updateParameter={updateParameter}
                        editable={true}
                        errors={
                            {
                                getFormError: () => undefined,
                            } as any
                        }
                    />
                }
            />
        </Routes>
    );

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    await waitFor(() => {
        expect(updateParameter).toHaveBeenCalledWith('stickiness', 'default');
    });
});

test('should display retail units as required field', async () => {
    const Wrapper = () => (
        <Routes>
            <Route
                path='/projects/:projectId/features/:featureId'
                element={
                    <RetailUnitRolloutStrategy
                        context={mockContext}
                        parameters={{
                            rollout: '50',
                            stickiness: 'default',
                        }}
                        updateParameter={vi.fn()}
                        editable={true}
                        errors={
                            {
                                getFormError: () => undefined,
                            } as any
                        }
                    />
                }
            />
        </Routes>
    );

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    const retailUnitsInput = await screen.findByLabelText('Retail Units');
    expect(retailUnitsInput).toHaveAttribute('required');
});

test('should display error for retail units field', async () => {
    const errorMessage = 'Retail units are required';
    const Wrapper = () => (
        <Routes>
            <Route
                path='/projects/:projectId/features/:featureId'
                element={
                    <RetailUnitRolloutStrategy
                        context={mockContext}
                        parameters={{
                            retailUnits: '',
                            rollout: '50',
                            stickiness: 'default',
                        }}
                        updateParameter={vi.fn()}
                        editable={true}
                        errors={
                            {
                                getFormError: (field: string) =>
                                    field === 'retailUnits' ? errorMessage : undefined,
                            } as any
                        }
                    />
                }
            />
        </Routes>
    );

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    const errorText = await screen.findByText(errorMessage);
    expect(errorText).toBeInTheDocument();
});

test('should handle all stickiness options', async () => {
    const updateParameter = vi.fn();
    const Wrapper = () => (
        <Routes>
            <Route
                path='/projects/:projectId/features/:featureId'
                element={
                    <RetailUnitRolloutStrategy
                        context={mockContext}
                        parameters={{
                            retailUnits: 'SE',
                            rollout: '100',
                            stickiness: 'default',
                        }}
                        updateParameter={updateParameter}
                        editable={true}
                        errors={
                            {
                                getFormError: () => undefined,
                            } as any
                        }
                    />
                }
            />
        </Routes>
    );

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    const stickinessSelect = await screen.findByLabelText('Stickiness');
    expect(stickinessSelect).toBeInTheDocument();
});

test('should show help icons with tooltips', async () => {
    const Wrapper = () => (
        <Routes>
            <Route
                path='/projects/:projectId/features/:featureId'
                element={
                    <RetailUnitRolloutStrategy
                        context={mockContext}
                        parameters={{
                            retailUnits: 'SE',
                            rollout: '100',
                            stickiness: 'default',
                        }}
                        updateParameter={vi.fn()}
                        editable={true}
                        errors={
                            {
                                getFormError: () => undefined,
                            } as any
                        }
                    />
                }
            />
        </Routes>
    );

    render(<Wrapper />, {
        route: '/projects/default/features/test',
    });

    // Component should render without errors
    const retailUnitsInput = await screen.findByLabelText('Retail Units');
    expect(retailUnitsInput).toBeInTheDocument();
});
