import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { colors } from "../../styles/theme";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import StatusTag from "./Status";
import CustomTypography from "./Typography";
import { useTranslation } from "react-i18next";

interface StatusCardProps {
  onStatusSelect: (status: "active" | "inactive") => Promise<void>;
}

const StatusCard: React.FC<StatusCardProps> = ({ onStatusSelect }) => {
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "inactive" | null
  >(null);

  const { t } = useTranslation();

  const handleClick = async (status: "active" | "inactive") => {
    await onStatusSelect(status);
  };

  return (
    <Box
      sx={{
        background: colors.c6,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: 4,
        border: `1px solid ${colors.c22}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxShadow: "none",
        gridArea: "1 / 1",
        justifyContent: "center",
        paddingBottom: 2,
        // marginTop: ,
        position: "relative",
        zIndex: 10,
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
        <Typography
          sx={{
            color: colors.c11,
            fontSize: 16,
            fontFamily: "Heebo",
            fontWeight: 400,
            paddingRight: 5.3,
          }}
        >
          סטטוס לקוח
        </Typography>
      </Box>
      <ChevronDownIcon
        style={{
          width: "16px",
          height: "16px",
          color: "#032B40",
          position: "absolute",
          top: 16,
          left: 10,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{ height: 50, display: "flex", gap: 1, justifyContent: "center" }}
      >
        <Button
          onClick={() => handleClick("inactive")}
          sx={{
            // ...baseButtonStyles,
            background: selectedStatus === "inactive" ? colors.c32 : colors.c18,
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
            // ...baseButtonStyles,
            background: selectedStatus === "active" ? colors.c33 : colors.c25,
            "&:hover": {
              background: colors.c33,
            },
          }}
        >
          פעיל
        </Button>
        <CustomTypography
          variant="h4"
          weight="regular"
          text={t("customerStatus")}
        />
      </Box>
      <Box
        sx={{ height: 50, display: "flex", gap: 1, justifyContent: "center" }}
      >
        <Box sx={{ cursor: "pointer" }} onClick={() => handleClick("inactive")}>
          <StatusTag status="inactive" />
        </Box>
        <Box sx={{ cursor: "pointer" }} onClick={() => handleClick("active")}>
          <StatusTag status="active" />
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCard;