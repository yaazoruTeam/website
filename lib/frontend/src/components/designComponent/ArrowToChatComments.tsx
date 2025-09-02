import React from 'react';
import { Box } from '@mui/material';
import { ArrowLeftIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface ArrowToChatCommentsProps {
  onClick?: () => void;
}

const ArrowToChatComments: React.FC<ArrowToChatCommentsProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '55px',
        paddingBottom: '55px',
        backgroundColor: '#0059BA',
        borderRadius: '50px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          backgroundColor: '#004494',
        } : {},
        position: 'relative',
      }}
    >
      {/* Chat bubble background */}
      <ChatBubbleLeftIcon
        style={{
          width: '48px',
          height: '48px',
          transform: 'scaleX(-1)',
        //   color: 'none',
        }}
      />
      
      {/* Arrow inside the chat bubble */}
      <ArrowLeftIcon
        style={{
          width: '20px',
          height: '20px',
          color: 'white',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  );
};

export default ArrowToChatComments;