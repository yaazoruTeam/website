// import React, { useState, useEffect, useRef } from "react";
// import {
//   FormControl,
//   Select,
//   MenuItem,
//   Box,
//   Popper,
//   InputBase,
// } from "@mui/material";
// import { getCustomers, getCustomersByDateRange } from "../../api/customerApi";
// import CityOptions from "./CityOptions";
// import DateRangePickerComponent from "./Calendar";
// import {
//   ChevronDownIcon,
//   ChevronLeftIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline";
// import { colors } from "../../styles/theme";

// interface CustomSearchSelectProps {
//   placeholder?: string;
//   searchType: "city" | "date";
//   onCitySelect?: (city: string) => void;
//   onSelect?: (filterType: "city" | "date") => void;
// }

// const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
//   placeholder,
//   searchType,
//   onCitySelect,
//   onSelect,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedCity, setSelectedCity] = useState<string>("");
//   const selectRef = useRef<HTMLDivElement | null>(null);
//   const [options, setOptions] = useState<string[]>([]);

//   useEffect(() => {
//     if (searchType === "city") {
//       fetchCities();
//     }
//   }, [searchType]);

//   // useEffect(() => {
//   //   const handleClickOutside = (event: MouseEvent) => {
//   //     if (
//   //       selectRef.current &&
//   //       !selectRef.current.contains(event.target as Node)
//   //     ) {
//   //       setOpen(false);
//   //     }
//   //   };

//   //   document.addEventListener("mousedown", handleClickOutside);

//   //   return () => {
//   //     document.removeEventListener("mousedown", handleClickOutside);
//   //   };
//   // }, []);

//   const fetchCities = async () => {
//     try {
//       const citiesData = await getCustomers();
//       console.log("Fetched cities data:", citiesData);

//       if (!Array.isArray(citiesData)) {
//         console.error("Expected array but got:", citiesData);
//         return;
//       }

//       const uniqueCities = Array.from(
//         new Set(citiesData.map((customer) => customer.city))
//       );
//       setOptions(uniqueCities);
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     }
//   };

//   const handleSelectClick = (event: React.SyntheticEvent<Element, Event>) => {
//     if (event.currentTarget instanceof HTMLElement) {
//       setAnchorEl(event.currentTarget);
//       setOpen((prev) => !prev);
//     }
//   };

//   const handleCitySelect = (city: string) => {
//     setSelectedCity(city);
//     setOpen(false);
//     onCitySelect?.(city);
//   };

//   const handleDateRangeSelect = (start: Date, end: Date) => {
//     console.log("Selected date range:", start, end);
//     onSelect?.("date");
//     getCustomersByDateRange(start, end)
//   };

//   return (
//     <Box ref={selectRef}>
//       <FormControl fullWidth>
//         <Select
//           open={false}
//           value={selectedCity}
//           displayEmpty
//           onOpen={handleSelectClick}
//           renderValue={(selected) => (selected ? selected : placeholder)}
//           sx={{
//             backgroundColor: colors.brand.color_14,
//             border: `1px solid ${colors.brand.color_12}`,
//             borderRadius: 4,
//             width: "200px",
//             height: "50px",
//             padding: "0 10px",
//             display: "flex",
//             alignItems: "center",
//             "& fieldset": { border: "none" },
//             textAlign: "right",
//             justifyContent: "flex-end",
//             position: "relative",
//             "& .MuiSelect-icon": {
//               display: "none",
//             },
//           }}
//           input={<InputBase />}
//           endAdornment={
//             searchType === "city" ? (
//               open ? (
//                 <ChevronDownIcon
//                   style={{
//                     width: "16px",
//                     height: "16px",
//                     color: colors.brand.color_9,
//                     position: "absolute",
//                     top: 16,
//                     left: "10px",
//                   }}
//                 />
//               ) : (
//                 <ChevronLeftIcon
//                   style={{
//                     width: "16px",
//                     height: "16px",
//                     color: colors.brand.color_9,
//                     position: "absolute",
//                     top: 16,
//                     left: "10px",
//                   }}
//                 />
//               )
//             ) : (
//               <CalendarIcon
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   color: colors.brand.color_9,
//                   position: "absolute",
//                   top: 16,
//                   left: "10px",
//                 }}
//               />
//             )
//           }
//         >
//           <MenuItem value="" disabled>
//             {placeholder}
//           </MenuItem>
//         </Select>
//       </FormControl>

//       <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
//         <CityOptions cities={options} onCitySelect={handleCitySelect} />
//       </Popper>
//     </Box>
//   );
// };

// export default CustomSearchSelect;

import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Popper,
  InputBase,
} from "@mui/material";
import { getCustomers, getCustomersByDateRange } from "../../api/customerApi";
import CityOptions from "./CityOptions";
import DateRangePickerComponent from "./DateRangeSelector";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { colors } from "../../styles/theme";
import { Customer } from "../../model/src";
import StatusCard from "./StatusCard";

interface CustomSearchSelectProps {
  placeholder?: string;
  searchType: "city" | "date" | "status";
  onCitySelect?: (city: string) => void;
  onDateRangeSelect?: (start: string, end: string) => void;
}

const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
  placeholder,
  searchType,
  onCitySelect,
  onDateRangeSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const selectRef = useRef<HTMLDivElement | null>(null);

  // Fetching Cities
  useEffect(() => {
    if (searchType === "city") {
      fetchCities();
    }
  }, [searchType]);

  // Fetching customers by date range
  useEffect(() => {
    if (searchType === "date" && dateRange) {
      fetchCustomersByDateRange(dateRange.start, dateRange.end);
    }
  }, [dateRange, searchType]);

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

  const fetchCustomersByDateRange = async (start: string, end: string) => {
    try {
      const filteredCustomers = await getCustomersByDateRange(start, end);
      onDateRangeSelect?.(start, end); // נשלח את התוצאה להורה
    } catch (error) {
      console.error("Error fetching customers by date range:", error);
      onDateRangeSelect?.("", ""); // במקרה של שגיאה, נשלח מערך ריק
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

  const handleDateRangeSelect = (start: string, end: string) => {
    setDateRange({ start, end }); // עדכון מצב ה-TodateRange
    setOpen(false);
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
          // position: "absolute",
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
              backgroundColor: colors.brand.color_14,
              border: `1px solid ${colors.brand.color_12}`,
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
              searchType === "city" ? (
                open ? (
                  <ChevronDownIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: colors.brand.color_9,
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
                      color: colors.brand.color_9,
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
                    color: colors.brand.color_9,
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

        {searchType === "status" && open && <StatusCard />}
      </Box>
    </Box>
  );
};

export default CustomSearchSelect;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   FormControl,
//   Select,
//   MenuItem,
//   Box,
//   Popper,
//   InputBase,
// } from "@mui/material";
// import { getCustomers } from "../../api/customerApi";
// import CityOptions from "./CityOptions";
// import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
// import { colors } from "../../styles/theme";

// interface CustomSearchSelectProps {
//   placeholder?: string;
//   searchType: "city" | "date";
//   onCitySelect?: (city: string) => void;
// }

// const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
//   placeholder,
//   searchType,
//   onCitySelect,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedCity, setSelectedCity] = useState<string>("");
//   const [options, setOptions] = useState<string[]>([]);
//   const [selectWidth, setSelectWidth] = useState<number>(200);
//   const selectRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (searchType === "city") {
//       fetchCities();
//     }
//   }, []);

//   const fetchCities = async () => {
//     try {
//       const citiesData = await getCustomers();
//       if (!Array.isArray(citiesData)) {
//         console.error("Expected array but got:", citiesData);
//         return;
//       }

//       const uniqueCities = Array.from(
//         new Set(citiesData.map((customer) => customer.city))
//       );
//       setOptions(uniqueCities);
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     }
//   };

//   const handleSelectClick = (event: React.SyntheticEvent<Element, Event>) => {
//     if (event.currentTarget instanceof HTMLElement) {
//       setAnchorEl(event.currentTarget);
//       setSelectWidth(event.currentTarget.clientWidth); // קובע את הרוחב של הפופאפ
//       setOpen((prev) => !prev);
//     }
//   };

//   const handleCitySelect = (city: string) => {
//     setSelectedCity(city);
//     setOpen(false);
//     onCitySelect?.(city);
//   };

//   return (
//     <Box>
//       <FormControl fullWidth>
//         <Select
//           ref={selectRef} // 🟢 שימוש ב-ref
//           open={false}
//           value={selectedCity}
//           displayEmpty
//           onOpen={handleSelectClick}
//           renderValue={(selected) => (selected ? selected : placeholder)}
//           sx={{
//             backgroundColor: colors.brand.color_14,
//             border: `1px solid ${colors.brand.color_12}`,
//             borderRadius: 4,
//             width: "200px",
//             height: "50px",
//             padding: "0 10px",
//             display: "flex",
//             alignItems: "center",
//             "& fieldset": { border: "none" },
//             textAlign: "right",
//             justifyContent: "flex-end",
//             position: "relative",
//             "& .MuiSelect-icon": {
//               display: "none",
//             },
//           }}
//           input={<InputBase />}
//           endAdornment={
//             open ? (
//               <ChevronDownIcon
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   color: `${colors.brand.color_9}`,
//                   position: "absolute",
//                   top: 16,
//                   left: "10px",
//                 }}
//               />
//             ) : (
//               <ChevronLeftIcon
//                 style={{
//                   width: "16px",
//                   height: "16px",
//                   color: `${colors.brand.color_9}`,
//                   position: "absolute",
//                   top: 16,
//                   left: "10px",
//                 }}
//               />
//             )
//           }
//         >
//           <MenuItem value="" disabled>
//             {placeholder}
//           </MenuItem>
//         </Select>
//       </FormControl>

//       <Popper
//         anchorEl={selectRef.current}
//         open={open}
//         // anchorEl={anchorEl}
//         placement="bottom-end" // 🟢 תיקון חשוב ל-RTL
//         disablePortal={true}
//         modifiers={[
//           {
//             name: "offset",
//             options: {
//               offset: [0, 4], // רווח קטן מתחת למלבן
//             },
//           },
//         ]}
//       >
//         <Box sx={{ width: anchorEl?.clientWidth || 200 }} dir="rtl">
//           <CityOptions cities={options} onCitySelect={handleCitySelect} />
//         </Box>
//       </Popper>
//     </Box>
//   );
// };

// export default CustomSearchSelect;
