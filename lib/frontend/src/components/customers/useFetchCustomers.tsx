import { useState, useEffect } from "react";
import { getCustomers } from "../../api/customerApi";
import { Customer } from "../../model";

export const useFetchCustomers = () => {
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

  return { customers, isLoading, error };
};
