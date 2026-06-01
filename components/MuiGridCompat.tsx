import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { CSSProperties, ReactNode } from 'react';

type GridCompatProps = {
    children?: ReactNode;
    container?: boolean;
    item?: boolean;
    direction?: CSSProperties['flexDirection'];
    justifyContent?: CSSProperties['justifyContent'];
    alignItems?: CSSProperties['alignItems'];
    spacing?: number | string;
    p?: number | string;
    sx?: SxProps<Theme>;
};

function spacingValue(value: number | string | undefined) {
    if (typeof value == 'number') {
        return `${value * 8}px`;
    }
    return value;
}

export default function Grid(props: GridCompatProps) {
    const {children, container, direction, justifyContent, alignItems, spacing, p, sx} = props;

    return (
        <Box
            sx={{
                display: container ? 'flex' : undefined,
                flexDirection: container ? direction : undefined,
                justifyContent,
                alignItems,
                gap: container ? spacingValue(spacing) : undefined,
                p: spacingValue(p),
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
