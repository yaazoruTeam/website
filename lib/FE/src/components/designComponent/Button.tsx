import { ButtonProps, Button } from "@mui/material";
import React from "react";
import { colors } from "../../styles/theme";
import TypographyComponent from "./Typography";

export interface CustomButtonProps extends ButtonProps {
    label: string;
    icon?: React.ReactElement;
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
                color={currentButtonStyle.color}
            />
            {icon && React.isValidElement(icon) && (
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { width: '24px', height: '24px' } })}
                </span>
            )}
        </Button>
    );
};
