// import React, { useState } from "react";
// import dayjs, { Dayjs } from "dayjs";
// import "dayjs/locale/he";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import { colors } from "../../styles/theme";
// import { Box } from "@mui/material";

// const CalendarComponent: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
//       <Box
//         sx={{
//           width: "fit-content",
//           padding: "10px",
//           border: `1px solid ${colors.brand.color_12}`,
//           borderRadius: "12px",
//           //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//           backgroundColor: "#fff",
//         }}
//       >
//         <DateCalendar
//           value={selectedDate}
//           onChange={(newDate) => setSelectedDate(newDate)}
//           sx={{
//             fontFamily: "Heebo",
//             "& .MuiDayCalendar-header": {
//               fontSize: "1.5rem !important", // שנה את גודל הפונט
//               fontWeight: "bold !important", // אם אתה רוצה שיהיה ב-bold
//               color: `${colors.brand.color_4} !important`, // הגדר את הצבע שלך עם !important
//               textAlign: "center",
//               direction: "rtl", // לוודא שזה מימין לשמאל
//             },
//             "& .css-4k4mmf-MuiButtonBase-root-MuiPickersDay-root": {
//               fontSize: "16px !important",
//               transition: "background-color 0.3s ease",
//               color: "gray",
//               fontFamily: "Heebo",
//             },
//             "& .MuiDayPicker-day:hover": {
//               backgroundColor: "transparent",
//             },
//             "& .Mui-selected": {
//               // fontFamily:
//               fontSize: "16px !important",
//               backgroundColor: "transparent !important", // מבטל את הרקע הכחול
//               //   color: "inherit !important", // מחזיר את הצבע המקורי
//               //   fontWeight: "bold !important",
//               color: `${colors.brand.color_4} !important`,
//               border: "none", // מוודא שאין גבול מסביב
//             },
//             "& .MuiDayPicker-day.Mui-selected": {
//               backgroundColor: "transparent !important",
//               fontSize: "16px !important", // הוספת !important כאן
//               //   color: "orange !important",
//             },
//           }}
//         />
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default CalendarComponent;

// DateRangePickerComponent.tsx

// הקוד היותר חדש ⤵⬇

// import React, { useState } from "react";
// import { Box, Popper } from "@mui/material";
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import { DateRange } from '@mui/x-date-pickers-pro/models';
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import dayjs, { Dayjs } from "dayjs";
// import "dayjs/locale/he";

// interface DateRangePickerProps {
//   onSelectRange: (startDate: string, endDate: string) => void;
//   anchorEl: HTMLElement | null;
//   onClose: () => void;
// }

// const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({ onSelectRange, anchorEl, onClose }) => {
//   const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);

//   const handleChange = (newValue: DateRange<Dayjs>) => {
//     setValue(newValue);
//     if (newValue[0] && newValue[1]) {
//       // onSelectRange(newValue[0].toDate(), newValue[1].toDate());
//       onSelectRange(newValue[0]?.format('YYYY-MM-DD'), newValue[1]?.format('YYYY-MM-DD'));
//       onClose(); // Close the popper after selection
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
//       <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
//         <Box sx={{ bgcolor: 'white', p: 2, boxShadow: 2 }}>
//           <DateRangePicker
//             calendars={1}
//             value={value}
//             onChange={handleChange}
//           />
//         </Box>
//       </Popper>
//     </LocalizationProvider>
//   );
// };

// export default DateRangePickerComponent;

/// 27/04/25------------------------------------------------------------------------

// import React, { useState, useRef } from "react";
// import { Box, Popper } from "@mui/material";
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
// import { DateRange } from '@mui/x-date-pickers-pro/models';
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import dayjs, { Dayjs } from "dayjs";
// import "dayjs/locale/he";

// interface DateRangePickerProps {
//   onSelectRange: (startDate: string, endDate: string) => void;
//   anchorEl: HTMLElement | null;
//   onClose: () => void;
// }

// const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({ onSelectRange, anchorEl, onClose }) => {
//   const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
//   const lastSentRange = useRef<DateRange<Dayjs>>([null, null]);

//   const handleChange = (newValue: DateRange<Dayjs>) => {
//     setValue(newValue);
//   };

//   const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
//     if (!event.currentTarget.contains(event.relatedTarget as Node)) {
//       if (value[0] && value[1]) {
//         const lastStart = lastSentRange.current[0];
//         const lastEnd = lastSentRange.current[1];
//         const isSameRange =
//           lastStart?.isSame(value[0], 'day') && lastEnd?.isSame(value[1], 'day');

//         if (!isSameRange) {
//           onSelectRange(value[0].format('DD-MM-YYYY'), value[1].format('DD-MM-YYYY'));
//           lastSentRange.current = value;
//         }
//       }
//       onClose();
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
//       <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
//         <Box sx={{ bgcolor: 'white', p: 2, boxShadow: 2 }} tabIndex={0} onBlur={handleBlur}>
//           <DateRangePicker
//             calendars={1}
//             value={value}
//             onChange={handleChange}
//           />
//         </Box>
//       </Popper>
//     </LocalizationProvider>
//   );
// };

// export default DateRangePickerComponent;

// 28/04/25===============================================================================

// DateRangeSelector.tsx
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { DateRange, DateRangePicker } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/he";

interface DateRangeSelectorProps {
  anchorEl: HTMLElement | null;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeSelect,
}) => {
  const [dateRange, setDateRange] = useState<DateRange<Dayjs>>([null, null]);

  const handleApply = () => {
    if (dateRange[0] && dateRange[1]) {
      const start = dateRange[0].format("DD-MM-YYYY");
      const end = dateRange[1].format("DD-MM-YYYY");
      onDateRangeSelect(start, end);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DateRangePicker
          calendars={1}
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          localeText={{ start: "תאריך התחלה", end: "תאריך סיום" }}
        />
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!dateRange[0] || !dateRange[1]}
        >
          סנן לפי טווח תאריכים
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangeSelector;
