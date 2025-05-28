import { useState, useEffect } from "react";
import { getCustomers } from "../../api/customerApi";
import { Customer } from "../../model";

export const useFetchCustomers = (page: number, limit: number = 10) => {
  const [customers, setCustomers] = useState<Customer.Model[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const { data, total } = await getCustomers(page);
        setCustomers(data);
        setTotal(total);
      } catch (err) {
        setError("Failed to fetch customers.");
        console.error(err);
        setCustomers([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [page, limit]);

  return { customers, total, isLoading, error };
};
