import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import AddCustomerForm from "./AddCustomerForm";
import { CustomButton } from "../../stories/Button/Button";
import { addNewCustomerArgs } from "../../stories/Button/Button.stories";

interface CustomersListProps {
  customers: string[];
}

const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  return (
    <Box
      sx={{
        width: "50%",
        height: "50%",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 4,
      }}
    >
      {showAddCustomer ? (
        <AddCustomerForm onBack={() => setShowAddCustomer(false)} />
      ) : (
        <>
          <CustomButton {...addNewCustomerArgs} onClick={() => setShowAddCustomer(true)}/>
          <Box
            sx={{
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
                  width: 1000,
                  height: 81,
                  paddingLeft: 3,
                  paddingRight: 3,
                  backgroundColor: "white",
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
                <Typography
                  sx={{
                    color: "#0059BA",
                    fontSize: 28,
                    fontFamily: "Assistant, sans-serif",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    wordWrap: "break-word",
                    textAlign: "center",
                  }}
                >
                  {customer}
                </Typography>
              </Button>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomersList;
