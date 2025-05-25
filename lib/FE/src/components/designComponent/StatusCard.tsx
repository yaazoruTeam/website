import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { colors } from "../../styles/theme";

interface StatusCardProps {
  onStatusSelect: (status: 'active' | 'inactive') => Promise<void>;
}

const StatusCard: React.FC<StatusCardProps> = ({ onStatusSelect }) => {
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | null>(null);

  const handleClick = async (status: 'active' | 'inactive') => {    
    setSelectedStatus(status);
    await onStatusSelect(status);
  };

  const baseButtonStyles = {
    px: 2,
    py: 0.5,
    borderRadius: 8,
    color: colors.c11,
    fontFamily: "Heebo",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "right" as const,
    width: 100,
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        px: 2,
        background: colors.c6,
        borderRadius: 2,
        outline: `1px solid ${colors.c22}`,
        outlineOffset: "-1px",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          py: "14px",
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: 16, height: 16 }} />
        <Typography sx={{ color: colors.c11, fontSize: 16, fontFamily: "Heebo", fontWeight: 400 }}>
          סטטוס לקוח
        </Typography>
      </Box>

      <Box sx={{ height: 50, display: "flex", gap: 1, justifyContent: "center" }}>
        <Button
          onClick={() => handleClick("inactive")}
          sx={{
            ...baseButtonStyles,
            background:
              selectedStatus === "inactive"
                ? colors.c32
                : colors.c18,
            "&:hover": {
              background: colors.c32,
            },
          }}
        >
          לא פעיל
        </Button>

        <Button
          onClick={() => handleClick("active")}
          sx={{
            ...baseButtonStyles,
            background:
              selectedStatus === "active"
                ? colors.c33
                : colors.c25,
            "&:hover": {
              background: colors.c33,
            },
          }}
        >
          פעיל
        </Button>
      </Box>
    </Box>
  );
};

export default StatusCard;