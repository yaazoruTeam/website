import React from "react";
import CustomersList from "./customersList";
import { useFetchCustomers } from "./useFetchCustomers";
import ChatBot from "../ChatBot/ChatBot";

const Customers: React.FC = () => {
  const { customers, isLoading, error } = useFetchCustomers();

  if (isLoading) return <div>Loading customers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
        <CustomersList customers={customers} />
        <ChatBot entityType="customer" entityId="1"/>
    </>
  );
};

export default Customers;
