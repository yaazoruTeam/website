import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const FilterResetCard: React.FC = () => {
  return (
    <Button
      sx={{
        width: '100%',
        height: '50px',
        paddingLeft: 2,
        paddingRight: 2,
        opacity: 0.5,
        borderRadius: 4,
        outline: '1px solid rgba(11.47, 57.77, 81.74, 0.36)',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 1,
        display: 'inline-flex',
      }}
    >
      <Box
        sx={{
          paddingTop: 1,
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: '#032B40',
            fontSize: 16,
            fontFamily: 'Heebo, sans-serif',
            fontWeight: 400,
            wordWrap: 'break-word',
          }}
        >
          אפס סינון
        </Typography>
      </Box>
    </Button>
  );
};

export default FilterResetCard;
