import { useState, useEffect } from "react";
import { getCustomers, getCustomersByCity, getCustomersByStatus, getCustomersByDateRange, getCustomersByName } from "../../api/customerApi";
import { Customer } from "../../model";

interface UseFetchCustomersProps {
  page: number;
  filterType?: {
    type: "city" | "status" | "date" | "search";
    value: any;
  };
}

export const useFetchCustomers = ({ page, filterType }: UseFetchCustomersProps) => {
  const [customers, setCustomers] = useState<Customer.Model[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        let data, total;
        if (!filterType) {
          const res = await getCustomers(page);
          data = res.data;
          total = res.total;
        } else if (filterType.type === "city") {
          const res = await getCustomersByCity(filterType.value, page);
          data = res.data;
          total = res.total;
        } else if (filterType.type === "status") {
          const res = await getCustomersByStatus(filterType.value, page);
          data = res.data;
          total = res.total;
        } else if (filterType.type === "date") {
          const res = await getCustomersByDateRange(filterType.value.start, filterType.value.end, page);
          data = res.data;
          total = res.total;
        } else if (filterType.type === "search") {
          const res = await getCustomersByName(filterType.value, page);
          data = res.data;
          total = res.total;
        }
        setCustomers(data ?? []);
        setTotal(total ?? 0);
      } catch (error: any) {
        setError(`Failed to fetch customers: ${error.message}`);
        setCustomers([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [page, filterType]);

  return { customers, total, isLoading, error };
};