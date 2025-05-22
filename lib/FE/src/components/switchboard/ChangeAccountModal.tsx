import React from "react";
import { Box } from "@mui/material";
import { CustomTextField } from "../designComponent/Input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import CustomSelect from "../designComponent/CustomSelect";
import CustomTypography from "../designComponent/Typography";
import { CustomButton } from "../designComponent/Button";
import CustomModal from "../designComponent/Modal";

interface ChangeAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangeAccountModal: React.FC<ChangeAccountModalProps> = ({
  open,
  onClose,
}) => {
  const { control } = useForm();
  const { t } = useTranslation();

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "40px",
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            alignSelf: "stretch",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <CustomTypography
            text={t("switchAccount")}
            variant="h1"
            weight="medium" />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <CustomTextField
              name="theCustomerName"
              label={t("theCustomerName")}
              rules={{
                required: t("requiredField"),
              }}
              control={control}
            />
            <Box sx={{ width: "21.5px", height: "16px" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: "100%",
              gap: 1,
            }}
          >
            <CustomSelect
              name="category"
              control={control}
              options={[
                //to do : לבצע קריאת שרת של כל החשבונות ולפי זה להציג כאן
                { label: "כנפי חיים", value: "1" },
                { label: "כנפי חיים", value: "2" },
                { label: "כנפי חיים", value: "3" },
              ]}
              label={t("switchToAccount")}
              variant="changeAccount"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <CustomButton
            label={t("deletion")}
            buttonType="third"
            state="active"
            onClick={onClose}
          />
          <CustomButton
            label={t("replace")}
            buttonType="second"
            state="default" />
        </Box>
      </Box>
    </CustomModal>
  );
};

export default ChangeAccountModal;
