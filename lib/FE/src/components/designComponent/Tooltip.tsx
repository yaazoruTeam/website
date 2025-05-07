import React, { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { colors } from "../../styles/theme";
import CustomTypography from "./Typography";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

type TooltipPropsMy = {
  text: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  position?: "top" | "bottom" | "left" | "right" | "normal";
};

const primaryColor = colors.c10;
const secondaryColor = colors.c2;


const CustomTooltip: React.FC<TooltipPropsMy> = ({ text, children, position = "top", variant = "primary" }) => {

  const arrow = position !== 'normal';
  const tooltipPlacement = position === 'normal' ? 'top' : position;

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip
      {...props}
      arrow={arrow}
      classes={{ popper: className }}
      placement={tooltipPlacement}
      sx={{
        width: '40px',
        height: '40px'
      }}
    />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: variant === 'primary' ? primaryColor : secondaryColor,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: variant === 'primary' ? primaryColor : secondaryColor,
      width: '72px',
      height: '26px',
      padding: '4px 8px',
    },
  }));


  return (
    <BootstrapTooltip
      title={
        <Box
          sx={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '4px 4px'
          }}
        >
          <CustomTypography
            text={text}
            variant="h5"
            weight="regular"
            color={colors.c6}
          />
        </Box>
      }
    >
      <Box>{children}</Box>
    </BootstrapTooltip>

  );
};

export default CustomTooltip;
