import { Box, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../designComponent/Button";

const EditingContactsButtons: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexShrink: 0,
        alignSelf: "flex-start",
      }}
    >
      <CustomButton
        label={t("reset")}
        buttonType="third"
        state="default"
        size={isMobile ? "small" : "large"}
      />
      <CustomButton
        label={t("cancellation")}
        buttonType="third"
        state="default"
        size={isMobile ? "small" : "large"}
      />
      <CustomButton
        label={t("savingChanges")}
        buttonType="second"
        state="default"
        size={isMobile ? "small" : "large"}
      />
    </Box>
  );
};

export default EditingContactsButtons;
