import React from 'react';
import { Box, Typography } from '@mui/material';
import AddCustomerForm, { AddCustomerFormInputs } from '../../stories/Form/AddCustomerForm';
import { createCustomer } from '../../api/customerApi';
import { Customer } from '../../model/src';

interface Props {
  onBack: () => void;
}

const AddCustomer: React.FC<Props> = ({ onBack }) => {

  const addCustomer = async (data: AddCustomerFormInputs) => {
    console.log('add customer');
    console.log(data);
    const customerData: Customer.Model = {
      customer_id: '',
      first_name: data.first_name,
      last_name: data.last_name,
      id_number: data.id_number,
      email: data.email,
      phone_number: data.phone_number,
      additional_phone: data.additional_phone,
      city: data.city,
      address1: data.address,
      address2: '',
      zipCode: '2222',
      status: '',
    }
    try {
      await createCustomer(customerData);
      alert('הלקוח נוסף בהצלחה');
      window.location.reload();
    }
    catch (err: any) {
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
        left: 0,
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
          <Typography
            sx={{
              textAlign: 'center',
              color: '#0059BA',
              fontSize: 28,
              fontFamily: 'Heebo',
              fontWeight: 700,
              // lineHeight: 33.6,
              wordWrap: 'break-word',
            }}
          >
            הוספת לקוח
          </Typography>
        </Box>
      </Box>
      {/*כאן יהיה טופס*/}
      {/* התוכן שלך כאן */}
      <AddCustomerForm onSubmit={addCustomer} />
      <h1>hbgg</h1>
    </Box>
  );
};

export default AddCustomer;
