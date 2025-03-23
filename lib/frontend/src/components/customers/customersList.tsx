import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import AddCustomer from "./AddCustomer";
import { CustomButton } from "../designComponent/Button";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { Customer } from "../../model/src";
import CustomTable from "../designComponent/CustomTable";
import StatusTag from "../designComponent/Status";
import { useNavigate } from "react-router-dom";

interface CustomersListProps {
  customers: Customer.Model[];
}

const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  const { t } = useTranslation();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const columns = [
    { label: t('customerName'), key: 'customer_name' },
    { label: t('registrationDate'), key: 'registration_date' },
    { label: t('city'), key: 'city' },
    { label: '', key: 'status' },
  ];

  const tableData = customers.map(customer => ({
    customer_id: customer.customer_id,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    registrationDate:/*customer.*/new Date(Date.now()),
    city: customer.city,
    status: customer.status === 'active' ? <StatusTag status="active" /> : <StatusTag status="inactive" />
  }));

  const onClickCustomer = (customer: any) => {
    console.log(customer.customer_id);
    navigate(`/customer/card/${customer.customer_id}`)
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "50%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 4,
      }}
    >
      {showAddCustomer ? (
        <AddCustomer onBack={() => setShowAddCustomer(false)} />
      ) : (
        <>
          <Box sx={{
            direction: 'rtl',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <CustomTypography
              text={t('customerManagement')}
              variant="h1"
              weight="bold"
              color={colors.brand.color_9}
            />
            <CustomButton
              label={t('addingNewCustomer')}
              size={isMobile ? 'small' : 'large'}
              state="default"
              buttonType="first"
              onClick={() => setShowAddCustomer(true)} />
          </Box>
          <Box
            sx={{
              width: '100%',
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 3,
            }}
          >
            <CustomTable
              columns={columns}
              data={tableData}
              onRowClick={onClickCustomer}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomersList;
