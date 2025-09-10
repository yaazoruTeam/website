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
        backgroundColor: colors.orange500,
        color: colors.neutral0,
        border: `none`,
        hover: colors.blue600,
      },
      hover: {
        backgroundColor: colors.blueOverlay650,
        color: colors.neutral0,
        border: `none`,
        hover: '',
      },
      active: {
        backgroundColor: colors.neutral0,
        color: colors.neutral800,
        border: `1px solid ${colors.neutral800} `,
        hover: '',
      },
    },
    second: {
      default: {
        backgroundColor: colors.blue600,
        color: colors.neutral0,
        border: `none`,
        hover: '',
      },
      hover: {
        backgroundColor: colors.blueOverlay700,
        color: colors.neutral0,
        border: `none`,
        hover: '',
      },
      active: {
        backgroundColor: colors.neutral0,
        color: colors.blue600,
        border: `1px solid ${colors.blue600} `,
        hover: '',
      },
    },
    third: {
      default: {
        backgroundColor: colors.neutral0,
        color: colors.blue600,
        border: `1px solid ${colors.blueOverlay700} `,
        hover: '',
      },
      hover: {
        backgroundColor: colors.blueOverlay700,
        color: colors.neutral0,
        border: `none`,
        hover: '',
      },
      active: {
        backgroundColor: colors.neutral0,
        color: colors.blue600,
        border: `1px solid ${colors.blueOverlay700} `,
        hover: '',
      },
    },
    fourth: {
      default: {
        backgroundColor: 'transparent',
        color: colors.blue900,
        border: `1px solid ${colors.blue500}`,
        hover: colors.blueOverlay200,
      },
      hover: {
        backgroundColor: colors.blueOverlay200,
        color: colors.blue900,
        border: `1px solid ${colors.blue500}`,
        hover: '',
      },
      active: {
        backgroundColor: 'transparent',
        color: colors.blue900,
        border: `1px solid ${colors.blue500}`,
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
        color={disabled ? colors.blueOverlay700 : currentButtonStyle.color}
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
