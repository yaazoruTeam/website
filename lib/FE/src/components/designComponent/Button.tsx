import React from "react";
import { ButtonProps, Button } from "@mui/material";
import { colors } from "../../styles/theme";
import TypographyComponent from "./Typography";

export interface CustomButtonProps extends ButtonProps {
    label: string;
    icon?: React.ReactNode;
    size?: 'small' | 'large';
    buttonType?: 'first' | 'second' | 'third';
    state?: 'default' | 'hover' | 'active';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    sx,
    icon,
    size = 'large',
    buttonType = 'first',
    state = 'default',
    ...props
}) => {
    const buttonStyles = {
        first: {
            default: {
                backgroundColor: colors.brand.color_4,
                color: colors.neutral.white,
                border: `none`,
                hover: colors.brand.color_8,
            },
            hover: {
                backgroundColor: colors.brand.color_2,
                color: colors.neutral.white,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.neutral.white,
                color: colors.brand.color_10,
                border: `1px solid ${colors.brand.color_10} `,
                hover: '',
            }
        },
        second: {
            default: {
                backgroundColor: colors.brand.color_8,
                color: colors.neutral.white,
                border: `none`,
                hover: '',
            },
            hover: {
                backgroundColor: colors.brand.color_12,
                color: colors.neutral.white,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.neutral.white,
                color: colors.brand.color_8,
                border: `1px solid ${colors.brand.color_8} `,
                hover: '',
            }
        },
        third: {
            default: {
                backgroundColor: colors.neutral.white,
                color: colors.brand.color_8,
                border: `1px solid ${colors.brand.color_12} `,
                hover: '',
            },
            hover: {
                backgroundColor:colors.brand.color_12,
                color: colors.neutral.white,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.neutral.white,
                color: colors.brand.color_8,
                border: `1px solid ${colors.brand.color_12} `,
                hover: '',
            }
        }
    };

    const currentButtonStyle = buttonStyles[buttonType][state];

    return (
        <Button
            sx={{
                backgroundColor: currentButtonStyle.backgroundColor,
                color: currentButtonStyle.color,
                border: currentButtonStyle.border || 'none',
                padding: '10px 20px',
                display: 'flex',
                height: '40px',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '12px',
                justifyContent: 'flex-end',
                "&:hover": {
                    background: currentButtonStyle.hover,
                },
                ...sx,
            }}
            {...props}
        >
            <TypographyComponent
                text={label}
                variant={size === 'large' ? 'h4' : 'h5'}
                weight={state === 'active' ? size === 'large' ? 'medium' : 'bold' : 'regular'}
            />
            {icon && (
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {React.cloneElement(icon as React.ReactElement, { style: { width: '24px', height: '24px' } })}
                </span>
            )}
        </Button>
    );
};
