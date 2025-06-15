import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";

const ReturnButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      onClick={() => navigate(-1)}
      sx={{
        alignSelf: "flex-start",
        color: colors.c11,
        fontSize: 18,
        fontFamily: "Heebo",
        fontWeight: 400,
        textDecoration: "underline",
        wordWrap: "break-word",
        cursor: "pointer",
        userSelect: "none",
        marginTop: 1,
        marginRight: 1,
      }}
    >
      {t("return")}
    </Box>
  );
};

export default ReturnButton;