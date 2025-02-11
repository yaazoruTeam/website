import React from "react";
import { ButtonProps, Button } from "@mui/material";
import { colors } from "../../styles/theme";

export interface CustomButtonProps extends ButtonProps {
    icon: React.ReactNode;
    buttonType?: 'first' | 'second' | 'third';
    state?: 'default' | 'hover' | 'active';
}

export const CustomIconButton: React.FC<CustomButtonProps> = ({
    sx,
    icon,
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
                backgroundColor: colors.brand.color_12,
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
                border: currentButtonStyle.border || 'none',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                padding: '10px',
                borderRadius: '4px',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                boxSizing: 'border-box',
                "&:hover": {
                    background: currentButtonStyle.hover,
                },
                ...sx,
            }}
            {...props}
        >
            {React.cloneElement(icon as React.ReactElement, {
                style: {
                    width: '20px',
                    height: '20px',
                    color: currentButtonStyle.color,
                }
            })}
        </Button>
    );
};
