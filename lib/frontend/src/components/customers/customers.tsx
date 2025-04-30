import React from "react";
import CustomersList from "./customersList";
import { useFetchCustomers } from "./useFetchCustomers";
import { Box } from "@mui/system";
import CustomComponent from "../designComponent/CstomComponent";

const Customers: React.FC = () => {
  const { customers, isLoading, error } = useFetchCustomers();

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Box
        sx={{
          paddingLeft: '10%',
          paddingRight: '15%',
        }}
      >
        <CustomersList
          customers={customers}
        />
      </Box>
      <CustomComponent />
    </>
  );
};

export default Customers;
