import React from 'react'
import { ButtonProps, Button } from '@mui/material'
import { colors } from '../../styles/theme'

export interface CustomButtonProps extends ButtonProps {
  icon: React.ReactElement
  buttonType?: 'first' | 'second' | 'third'
  state?: 'default' | 'hover' | 'active'
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
  }

  const currentButtonStyle = buttonStyles[buttonType][state]

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
        '&:hover': {
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
        },
      })}
    </Button>
  )
}
