
import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";

interface StatusCardProps {
  // anchorEl: HTMLElement | null;
  // onStatusSelect: (startDate: string, endDate: string) => void;
  // onClose: () => void;
  // selectRef: React.RefObject<HTMLDivElement>; // הוספת selectRef כ-prop
}

// צבעים תואמים לעיצוב שלך
const InactiveButton = styled(Button)({
  padding: "4px 16px",
  background: "rgba(253, 209, 220, 0.74)",
  borderRadius: 16,
  color: "#032B40",
  textTransform: "none",
  fontSize: 16,
  fontFamily: "Heebo",
  fontWeight: 400,
});

const ActiveButton = styled(Button)({
  padding: "4px 16px",
  background: "rgba(182, 255, 203, 0.7)",
  borderRadius: 16,
  color: "#032B40",
  textTransform: "none",
  fontSize: 16,
  fontFamily: "Heebo",
  fontWeight: 400,
});

const StatusCard: React.FC<StatusCardProps> = ({
  // onStatusSelect,
  // selectRef,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  // useEffect(() => {
  //   if (selectRef?.current) {
  //     const rect = selectRef.current.getBoundingClientRect();
  //     setPosition({
  //       top: rect.top + window.scrollY, // הוספת גלילה אנכית
  //       left: rect.left + window.scrollX, // הוספת גלילה אופקית
  //       width: rect.width,
  //     });
  //   }
  // }, [selectRef]);

  return (
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          padding: 2,
          background: "white",
          borderRadius: 4,
          border: "1px solid rgba(11.47, 57.77, 81.74, 0.36)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          // position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        {/* כותרת */}
        <Box
          sx={{
            width: "100%",
            paddingY: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 16, height: 16, position: "relative" }}>
            {/* כאן אפשר לשים SVG אם יש אייקון מיוחד */}
          </Box>
          <Typography
            sx={{
              color: "#032B40",
              fontSize: 16,
              fontFamily: "Heebo",
              fontWeight: 400,
            }}
          >
            סטטוס לקוח
          </Typography>
        </Box>

        {/* כפתורי סטטוס */}
        <Box
          sx={{
            width: "100%",
            height: 50,
            display: "flex",
            gap: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              borderRadius: 100,
            }}
          >
            <ActiveButton fullWidth>פעיל</ActiveButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <InactiveButton fullWidth>לא פעיל</InactiveButton>
          </Box>
        </Box>
      </Paper>
  );
};

export default StatusCard;
