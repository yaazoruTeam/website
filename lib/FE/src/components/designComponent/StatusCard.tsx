import React from "react";
import { Box } from "@mui/material";
import { colors } from "../../styles/theme";
import CustomTypography from "./Typography";
import { useTranslation } from "react-i18next";
import StatusTag from "./Status";

interface StatusCardProps {
  onStatusSelect: (status: 'active' | 'inactive') => Promise<void>;
}

const StatusCard: React.FC<StatusCardProps> = ({ onStatusSelect }) => {
  const { t } = useTranslation();

  const handleClick = async (status: 'active' | 'inactive') => {
    await onStatusSelect(status);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        px: 2,
        background: colors.c6,
        borderRadius: 2,
        outline: colors.c22,
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
        <CustomTypography
          variant="h4"
          weight="regular"
          text={t('customerStatus')} />
      </Box>
      <Box sx={{ height: 50, display: "flex", gap: 1, justifyContent: "center" }}>
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("inactive")}>
          <StatusTag status="inactive" />
        </Box>
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => handleClick("active")}>
          <StatusTag status="active" />
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCard;
