import React, { useState, useEffect, useRef } from "react";
import { FormControl, Select, MenuItem, Box, Popper, InputBase } from "@mui/material";
import { getCustomers, getCustomersByDateRange, getCustomersByStatus } from "../../api/customerApi";
import CityOptions from "./CityOptions";
import DateRangePickerComponent from "./DateRangeSelector";
import { ChevronDownIcon, ChevronLeftIcon, CalendarIcon, } from "@heroicons/react/24/outline";
import { colors } from "../../styles/theme";
import StatusCard from "./StatusCard";

interface CustomSearchSelectProps {
  placeholder?: string;
  searchType: "city" | "date" | "status";
  onCitySelect?: (city: string) => void;
  onDateRangeSelect?: (start: Date, end: Date) => void;
  onStatusSelect?: (status: "active" | "inactive") => void;
}

const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
  placeholder,
  searchType,
  onCitySelect,
  onDateRangeSelect,
  onStatusSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "" | "active" | "inactive"
  >("");
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (searchType === "city") {
      fetchCities();
    }
  }, [searchType]);

  useEffect(() => {
    if (searchType === "date" && dateRange) {
      fetchCustomersByDateRange(dateRange.start, dateRange.end);
    }
  }, [searchType]);

  useEffect(() => {
    if (searchType === "status" && selectedStatus) {
      fetchStatusCard(selectedStatus);
    }
  }, [searchType]);

  const fetchCities = async () => {
    try {
      const citiesData = await getCustomers();
      if (!Array.isArray(citiesData)) {
        console.error("Expected array but got:", citiesData);
        return;
      }

      const uniqueCities = Array.from(
        new Set(citiesData.map((customer) => customer.city))
      );
      setOptions(uniqueCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchCustomersByDateRange = async (start: Date, end: Date) => {
    try {
      const filteredCustomers = await getCustomersByDateRange(start, end);
      if (!Array.isArray(filteredCustomers)) {
        console.error("Expected array but got:", filteredCustomers);
        return;
      }
    } catch (error) {
      console.error("Error fetching customers by date range:", error);
      onDateRangeSelect?.(new Date(""), new Date(""));
    }
  };

  const fetchStatusCard = async (status: "active" | "inactive") => {
    try {
      const filteredCustomers = await getCustomersByStatus(status);
      if (!Array.isArray(filteredCustomers)) {
        console.error("Expected array but got:", filteredCustomers);
        return;
      }
    } catch (error) {
      console.error("Error fetching customers by status:", error);
    }
  };

  const handleSelectClick = (event: React.SyntheticEvent<Element, Event>) => {
    if (event.currentTarget instanceof HTMLElement) {
      setAnchorEl(event.currentTarget);
      setOpen((prev) => !prev);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setOpen(false);
    onCitySelect?.(city);
  };

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setDateRange({ start, end });
    setOpen(false);
    onDateRangeSelect?.(start, end);
  };

  const handleStatusSelect = async (status: "active" | "inactive") => {
    setSelectedStatus(status);
    setOpen(false);
    onStatusSelect?.(status);
  };

  return (
    <Box
      ref={selectRef}
      sx={{
        width: 100,
        height: 100,
        display: "grid",
        position: "relative",
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          gridArea: "1 / 1",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
        }}
      >
        <FormControl fullWidth>
          <Select
            open={false}
            value={selectedCity}
            displayEmpty
            onOpen={handleSelectClick}
            renderValue={(selected) => (selected ? selected : placeholder)}
            sx={{
              backgroundColor: colors.c15,
              border: `1px solid ${colors.c22}`,
              borderRadius: 4,
              width: "200px",
              height: "50px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              "& fieldset": { border: "none" },
              textAlign: "right",
              justifyContent: "flex-end",
              position: "relative",
              "& .MuiSelect-icon": {
                display: "none",
              },
              zIndex: 5,
            }}
            input={<InputBase />}
            endAdornment={
              searchType === "city" || searchType === "status" ? (
                open ? (
                  <ChevronDownIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: colors.c11,
                      position: "absolute",
                      top: 16,
                      left: "10px",
                    }}
                  />
                ) : (
                  <ChevronLeftIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: colors.c11,
                      position: "absolute",
                      top: 16,
                      left: "10px",
                    }}
                  />
                )
              ) : (
                <CalendarIcon
                  style={{
                    width: "16px",
                    height: "16px",
                    color: colors.c11,
                    position: "absolute",
                    top: 16,
                    left: "10px",
                  }}
                />
              )
            }
          >
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          </Select>
        </FormControl>

        {searchType === "city" && (
          <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
            <CityOptions cities={options} onCitySelect={handleCitySelect} />
          </Popper>
        )}

        {searchType === "date" && open && (
          <DateRangePickerComponent
            anchorEl={anchorEl}
            onDateRangeSelect={handleDateRangeSelect}
            onClose={() => setOpen(false)}
          />
        )}

        {searchType === "status" && open && (
          <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
            <StatusCard onStatusSelect={handleStatusSelect} />
          </Popper>
        )}
      </Box>
    </Box>
  );
};

export default CustomSearchSelect;
