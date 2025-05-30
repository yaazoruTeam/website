import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import AddCustomer from "./AddCustomer";
import { CustomButton } from "../designComponent/Button";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { Customer } from "../../model/src";
import CustomTable from "../designComponent/CustomTable";
import StatusTag from "../designComponent/Status";
import { useNavigate } from "react-router-dom";
import FormatDate from "../designComponent/FormatDate";
import CustomSearchSelect from "../designComponent/CustomSearchSelect";
import {
  getCustomersByCity,
  getCustomersByDateRange,
} from "../../api/customerApi";
import FilterResetCard from "../designComponent/FilterResetCard";

interface CustomersListProps {
  customers: Customer.Model[];
}

const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  const { t } = useTranslation();
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [filteredCustomers, setFilteredCustomers] =
    useState<Customer.Model[]>(customers);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null); // חדש - מכיל את טווח התאריכים

  useEffect(() => {
    if (!filteredCustomers.length) {
      setFilteredCustomers(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (dateRange) {
      // קריאה לפונקציה שמביאה את הלקוחות לפי טווח התאריכים
      fetchCustomersByDateRange(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  const handleCitySelect = async (city: string) => {
    if (!city) {
      setFilteredCustomers(customers);
      return;
    }

    try {
      const cityCustomers = await getCustomersByCity(city);

      if (cityCustomers.length > 0) {
        setFilteredCustomers(cityCustomers);
      } else {
        setFilteredCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers by city:", error);
      setFilteredCustomers([]);
    }
  };

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setDateRange({ start, end }); // עדכון מצב ה-TodateRange
    fetchCustomersByDateRange(start, end); // הפעלת הפונקציה כדי לחפש לפי טווח תאריכים
  };

  const handleStatusSelect = (status: string) => {
    if (!status) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter((customer) => customer.status === status);
    setFilteredCustomers(filtered);
  };

  const fetchCustomersByDateRange = async (start: Date, end: Date) => {
    try {
      const customersInRange = await getCustomersByDateRange(start, end);
      setFilteredCustomers(customersInRange); // עדכון הלקוחות שהתקבלו בטווח התאריכים
    } catch (error) {
      console.error("Error fetching customers by date range:", error);
      setFilteredCustomers([]); // במקרה של שגיאה, נשלח מערך ריק
    }
  };

  const columns = [
    { label: t("customerName"), key: "customer_name" },
    { label: t("registrationDate"), key: "registration_date" },
    { label: t("city"), key: "city" },
    { label: "", key: "status" },
  ];

  const tableData = filteredCustomers.map((customer) => ({
    customer_id: customer.customer_id,
    customer_name: `${customer.first_name} ${customer.last_name}`,
    registration_date: <FormatDate date={customer.created_at} />,
    city: customer.city,
    status:
      customer.status === "active" ? (
        <StatusTag status="active" />
      ) : (
        <StatusTag status="inactive" />
      ),
  }));

  const onClickCustomer = (customer: any) => {
    console.log(customer.customer_id);
    navigate(`/customer/card/${customer.customer_id}`);
  };

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
          <Box
            sx={{
              direction: "rtl",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomTypography
              text={t("customerManagement")}
              variant="h1"
              weight="bold"
              color={colors.brand.color_9}
            />
            <CustomButton
              label={t("addingNewCustomer")}
              size={isMobile ? "small" : "large"}
              state="default"
              buttonType="first"
              onClick={() => setShowAddCustomer(true)}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              direction: "rtl",
              marginTop: 2,
              display: "flex",
              gap: 2,
              justifyContent: "flex-start", // אם אתה רוצה את ה-Selects בסדר קווים
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1, maxWidth: "15%", paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType="city"
                placeholder={t("CustomerCity")}
                onCitySelect={handleCitySelect}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: "15%", paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType="date"
                placeholder={t("DateInRange")}
                onDateRangeSelect={handleDateRangeSelect}
              />
            </Box>
            <Box sx={{ flex: 1, maxWidth: "15%", paddingLeft: 3 }}>
              <CustomSearchSelect
                searchType="status"
                placeholder={t("customerStatus")}
                onCitySelect={handleStatusSelect}
              />
            </Box>
            <Box>
              <FilterResetCard />
            </Box>
          </Box>

          {/* <Box
            sx={{
              width: "50%",
              marginTop: 2,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <CustomSearchSelect
                searchType="city"
                placeholder={t("CustomerCity")}
                onCitySelect={handleCitySelect}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <CustomSearchSelect
                searchType="date"
                placeholder={t("DateInRange")}
                onCitySelect={handleCitySelect}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <CustomSearchSelect
                searchType="city"
                placeholder={t("CustomerCity")}
                onCitySelect={handleCitySelect}
              />
            </Box>
          </Box> */}

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 3,
            }}
          >
            <CustomTable
              columns={columns}
              data={tableData}
              onRowClick={onClickCustomer}
              showSummary={true}
              alignLastColumnLeft={true}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomersList;
