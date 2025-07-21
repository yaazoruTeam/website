import React from 'react';
import { Box } from '@mui/material';
import CustomTypography from '../designComponent/Typography';
import { formatDateToString } from '../designComponent/FormatDate';
import { dateSeparatorStyles } from './styles';

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const formattedDateForDisplay = formatDateToString(date);

  return (
    <Box sx={dateSeparatorStyles.container}>
      <Box sx={dateSeparatorStyles.line} />
      <CustomTypography
        text={formattedDateForDisplay}
        variant="h5"
        weight="medium"
        sx={dateSeparatorStyles.dateText}
      />
      <Box sx={dateSeparatorStyles.line} />
    </Box>
  );
};

export default DateSeparator;
