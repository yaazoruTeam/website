import { ButtonProps, Button } from '@mui/material'
import React from 'react'
import { colors } from '../../styles/theme'
import TypographyComponent from './Typography'
export interface CustomButtonProps extends ButtonProps {
  label: string
  icon?: React.ReactElement
  size?: 'small' | 'large'
  buttonType?: 'first' | 'second' | 'third' | 'fourth'
  state?: 'default' | 'hover' | 'active'
  disabled?: boolean
}
export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  sx,
  icon,
  size = 'large',
  buttonType = 'first',
  state = 'default',
  disabled = false,
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
      },
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
      },
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
      },
    },
    fourth: {
      default: {
        backgroundColor: 'transparent',
        color: colors.c11,
        border: `1px solid ${colors.c8}`,
        hover: colors.c5,
      },
      hover: {
        backgroundColor: colors.c5,
        color: colors.c11,
        border: `1px solid ${colors.c8}`,
        hover: '',
      },
      active: {
        backgroundColor: 'transparent',
        color: colors.c11,
        border: `1px solid ${colors.c8}`,
        hover: '',
      },
    },
  }
  const currentButtonStyle = buttonStyles[buttonType][state]

  // Special styling for the "fourth" button type (from Figma)
  const isFourthType = buttonType === 'fourth'

  return (
    <Button
      disabled={disabled}
      sx={{
        backgroundColor: currentButtonStyle.backgroundColor,
        color: currentButtonStyle.color,
        border: currentButtonStyle.border || 'none',
        padding: isFourthType ? '10px 16px' : '10px 20px',
        display: 'flex',
        height: '40px',
        alignItems: 'center',
        gap: '10px',
        borderRadius: isFourthType ? '16px' : '4px',
        justifyContent: 'center',
        width: isFourthType ? '100%' : 'auto',
        fontFamily: isFourthType ? 'Heebo' : 'inherit',
        fontSize: isFourthType ? '16px' : 'inherit',
        fontWeight: isFourthType ? '400' : 'inherit',
        textAlign: isFourthType ? 'right' : 'inherit',
        '&:hover': {
          background: currentButtonStyle.hover,
        },
        ...sx,
      }}
      {...props}
    >
      <TypographyComponent
        text={label}
        variant={size === 'large' ? 'h4' : 'h5'}
        weight={state === 'active' ? (size === 'large' ? 'medium' : 'bold') : 'regular'}
        color={disabled ? colors.c22 : currentButtonStyle.color}
      />
      {icon && React.isValidElement(icon) && (
        <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: { width: '24px', height: '24px' },
          })}
        </span>
      )}
    </Button>
  )
}
