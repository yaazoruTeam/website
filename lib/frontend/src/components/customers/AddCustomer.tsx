import React from 'react';
import { Box } from '@mui/material';
import AddCustomerForm, { AddCustomerFormInputs } from './AddCustomerForm';
import CustomTypography from '../designComponent/Typography';
import { colors } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import { addCustomer } from './addCustomerLogic';

interface Props {
  onBack: () => void;
}

const AddCustomer: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();

  const handleAddCustomer = async (data: AddCustomerFormInputs) => {
    try {
      const newCustomer = await addCustomer(data);
      alert('הלקוח נוסף בהצלחה');
      console.log(newCustomer);
      window.location.reload();
    } catch (err: any) {
      if (err.status === 409) {
        alert(`שגיאה: מספר ת.ז או אימייל כבר קיימים`);
      }
      alert(`שגיאה: ${err}`);
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        // // padding: '2% 0',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '28px',
        // left: 0,
        // flexShrink: 0,
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          gap: 28,
          display: 'inline-flex',
        }}
      >
        <Box
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 28,
            display: 'flex',
          }}
        >
          <CustomTypography
            text={t('addCustomer')}
            variant='h1'
            weight='bold'
            color={colors.brand.color_7}
          />
        </Box>
      </Box>
      <AddCustomerForm onSubmit={handleAddCustomer} />
    </Box>
  );
};

export default AddCustomer;
