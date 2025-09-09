import React from 'react';
import { Box } from '@mui/material';
import chatButtonIcon from '../../assets/chatButtonIcon.svg';
import { colors } from '../../styles/theme';


interface ArrowToChatCommentsProps {
  onClick?: () => void;
}

const ArrowToChatComments: React.FC<ArrowToChatCommentsProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: '70%',
        height: '70%',
        backgroundColor: colors.c8,
        borderRadius: '50px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {/* Chat button icon */}
      <img
        src={chatButtonIcon}
        alt="Chat button"
        style={{
          width: 27,
          height: 24,
        }}
      />
    </Box>
  );
};

export default ArrowToChatComments;