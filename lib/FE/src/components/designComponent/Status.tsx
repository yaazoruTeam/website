import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import CustomTypography from "./Typography";
import { colors } from "../../styles/theme";

interface StatusTagProps {
  status: "active" | "inactive" | "blocked" | "canceled" | "imei_locked";
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const { t } = useTranslation();

  const statusMap: Record<StatusTagProps["status"], { label: string; color: string }> = {
    active: { label: t("active"), color: colors.status.success.light },
    inactive: { label: t("inactive"), color: colors.status.error.light },
    blocked: { label: t("blocked"), color: colors.status.yellow },
    canceled: { label: t("canceled"), color: colors.brand.color_20 },
    imei_locked: { label: t("imei_locked"), color: colors.brand.color_18 },
  };

  const { label, color } = statusMap[status] ?? { label: t("unknown"), color: colors.brand.color_13 };

  return (
    <Box
      data-status={label}
      sx={{
        width: "auto",
        height: "32px",
        px: 2, // paddingLeft + paddingRight
        py: 0.5, // paddingTop + paddingBottom
        background: color,
        borderRadius: 1,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <CustomTypography
        text={label}
        variant="h4"
        weight="regular"
        color={colors.brand.color_9}
      />
    </Box>
  );
};

export default StatusTag;
