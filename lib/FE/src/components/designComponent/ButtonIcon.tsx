import React from "react";
import { ButtonProps, Button } from "@mui/material";
import { colors } from "../../styles/theme";

export interface CustomButtonProps extends ButtonProps {
    icon: React.ReactElement;
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
                backgroundColor: colors.c3,
                color: colors.c6,
                border: `none`,
                hover: colors.c2,
            },
            hover: {
                backgroundColor: colors.c10,
                color: colors.c6,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.c6,
                color: colors.c0,
                border: `1px solid ${colors.c0} `,
                hover: '',
            }
        },
        second: {
            default: {
                backgroundColor: colors.c2,
                color: colors.c6,
                border: `none`,
                hover: '',
            },
            hover: {
                backgroundColor: colors.c22,
                color: colors.c6,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.c6,
                color: colors.c2,
                border: `1px solid ${colors.c2} `,
                hover: '',
            }
        },
        third: {
            default: {
                backgroundColor: colors.c6,
                color: colors.c2,
                border: `1px solid ${colors.c22} `,
                hover: '',
            },
            hover: {
                backgroundColor: colors.c22,
                color: colors.c6,
                border: `none`,
                hover: '',
            },
            active: {
                backgroundColor: colors.c6,
                color: colors.c2,
                border: `1px solid ${colors.c22} `,
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
            {React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: {
                    width: '20px',
                    height: '20px',
                    color: currentButtonStyle.color,
                }
            })}
        </Button>
    );
};
