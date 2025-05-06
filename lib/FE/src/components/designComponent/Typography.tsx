import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colors } from '../../styles/theme';

interface CustomTypographyProps {
    weight: 'regular' | 'medium' | 'bold';
    text: string;
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';  // תמיכה בכל סוגי ה-H
    color?: string;
    sx?: any;
}

const CustomTypography: React.FC<CustomTypographyProps> = ({ weight, text, variant, color = colors.brand.color_9, sx }) => {
    const theme = useTheme();

    // קביעת המשקל לפי הערך שנבחר
    let fontWeight: number;
    switch (weight) {
        case 'medium':
            fontWeight = 500;
            break;
        case 'bold':
            fontWeight = 700;
            break;
        case 'regular':
        default:
            fontWeight = 400;
    }

    return (
        <Typography
            variant={variant}  // ניתן לבחור איזה סוג H להציג כאן (h1, h2, h3 וכו')
            sx={{
                ...theme.typography[variant],  // משלב את הגדרות ה-variant מתוך ה-theme
                fontWeight: fontWeight,  // הוספת משקל
                color: color,
                ...sx
            }}
        >
            {text}
        </Typography>
    );
};

export default CustomTypography;
