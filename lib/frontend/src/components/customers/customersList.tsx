import React, { useState } from "react";
import { Button, Box, useMediaQuery } from "@mui/material";
import AddCustomer from "./AddCustomer";
import { CustomButton } from "../designComponent/Button";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";

interface CustomersListProps {
  customers: string[];
}

const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

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
          <CustomButton
            label="הוספת לקוח חדש"
            size={isMobile ? 'small' : 'large'}
            state="default"
            buttonType="first"
            onClick={() => setShowAddCustomer(true)} />
          <Box
            sx={{
              width:'100%',
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 3,
            }}
          >
            {customers.map((customer, index) => (
              <Button
                key={index}
                sx={{
                  width: '100%',
                  height: 81,
                  paddingLeft: 3,
                  paddingRight: 3,
                  backgroundColor: colors.neutral.white,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 3,
                  textTransform: "none",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
               <CustomTypography
               text={customer}
               variant="h4"
               weight="regular"
               color={colors.brand.color_7}
               />
              </Button>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomersList;
