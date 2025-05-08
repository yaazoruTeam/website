import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { colors } from '../../styles/theme';

interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 1,
  display: 'flex',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 1,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(17px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        backgroundColor: colors.c3,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.15)',
    width: 18,
    height: 18,
    borderRadius: '50%',
    backgroundColor: colors.c6,
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: '#ccc',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange }) => {
  return (
    <StyledSwitch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  );
};

export default CustomSwitch;
