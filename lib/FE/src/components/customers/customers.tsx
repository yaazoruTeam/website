import React, { useState } from "react";
import CustomersList from "./customersList";
import { useFetchCustomers } from "./useFetchCustomers";
import { Box } from "@mui/system";

const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { customers, total, isLoading, error } = useFetchCustomers(page, limit);

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Box
        sx={{
          paddingLeft: "10%",
          paddingRight: "15%",
        }}
      >
        <CustomersList customers={customers} total={total} page={page}  limit={limit} onPageChange={setPage}/>
      </Box>
    </>
  );
};

export default Customers;
