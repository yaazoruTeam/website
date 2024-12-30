import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface Props {
  onBack: () => void;
}

const AddClient: React.FC<Props> = ({ onBack }) => {
  return (
    <Box>
      <h1>form to add customer</h1>
      <Box style={{
        width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 8, display: 'inline-flex', background: "var(--feild, rgba(255, 255, 255, 0.58))"
      }}>
        <Typography style={{ textAlign: 'right', color: '#032B40', fontSize: 18, fontFamily: 'Heebo', fontWeight: '400', wordWrap: 'break-word' }}>שם משתמש</Typography>
        <TextField
          variant='standard'
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
          style={{
            border: 'none',
            alignSelf: 'stretch',
            textAlign: 'right',
            backgroundColor: 'rgba(214, 219, 227, 0.58)',
            borderRadius: '6px',
          }}
        />
      </Box>
    </Box>
  );
};

export default AddClient;


