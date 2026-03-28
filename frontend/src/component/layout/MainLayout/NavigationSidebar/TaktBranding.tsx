import { Box, styled } from '@mui/material';
import type { FC, ReactNode } from 'react';

const BrandContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
});

const Separator = styled('span')(({ theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: '28px',
    fontWeight: 200,
    lineHeight: 1,
    opacity: 0.5,
    marginLeft: '-6px',
}));

const TaktText = styled('span')(({ theme }) => ({
    fontWeight: 800,
    fontSize: '21px',
    letterSpacing: '0.03em',
    color: theme.palette.text.primary,
    lineHeight: 1,
    fontFamily: theme.typography.fontFamily,
}));

interface TaktBrandingProps {
    children: ReactNode;
}

export const TaktBranding: FC<TaktBrandingProps> = ({ children }) => {
    return (
        <BrandContainer>
            {children}
            <Separator>|</Separator>
            <TaktText>TAKT</TaktText>
        </BrandContainer>
    );
};
