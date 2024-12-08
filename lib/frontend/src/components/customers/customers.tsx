import React, { useState, useEffect } from "react";
import CustomersList from "./customersList";
import { getCustomers } from "../../api/customerApi";
import { Customer } from "../../model";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer.Model[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Failed to fetch customers.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
