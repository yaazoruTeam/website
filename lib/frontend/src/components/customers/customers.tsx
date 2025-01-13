import React from "react";
import CustomersList from "./customersList";
import { useFetchCustomers } from "./useFetchCustomers";

const Customers: React.FC = () => {
  const { customers, isLoading, error } = useFetchCustomers();

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <CustomersList
        customers={customers.map(
          (customer) => customer.first_name + " " + customer.last_name
        )}
      />
    </div>
  );
};

export default Customers;
