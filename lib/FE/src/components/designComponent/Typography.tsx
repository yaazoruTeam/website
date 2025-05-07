import { SxProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CustomTypographyProps {
    weight: 'regular' | 'medium' | 'bold';
    text: string;
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'; 
    color?: string;
    sx?: SxProps;
}

const CustomTypography: React.FC<CustomTypographyProps> = ({ weight, text, variant, color, sx }) => {
    const theme = useTheme();

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
            variant={variant}  
            sx={{
                ...theme.typography[variant],
                fontWeight: fontWeight,  
                color: color,
                ...sx
            }}
        >
            {text}
        </Typography>
    );
};

export default CustomTypography;
