import { Box, useMediaQuery } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { CustomTextField } from "../designComponent/Input";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../designComponent/Button";
import CustomTabs from "../designComponent/Tab";
import CustomerForm from "../customers/customerForm";
import CountryList from "./CountryList";
import { colors } from "../../styles/theme";
import { CustomIconButton } from "../designComponent/ButtonIcon";
import { PlusIcon } from "@heroicons/react/24/outline";

const EditingContacts: React.FC = () => {
  const { t } = useTranslation();

  const methods = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: "50%",
            backgroundColor: colors.c6,
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            flexDirection: "column",
            p: 4,
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "row-reverse",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <CustomTabs
                tabs={[
                  {
                    label: t("editingNumber"),
                    content: <CustomerForm />,
                  },
                  {
                    label: t("sdpeedDial"),
                    content: <CustomerForm />,
                  },
                ]}
                editingContacts={true}
              />
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingBottom: 4,
                  justifyContent: "flex-end",
                }}
              >
                <CountryList />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexShrink: 0,
                alignSelf: "flex-start",
              }}
            >
              <CustomButton
                label={t("savingChanges")}
                buttonType="second"
                state="default"
                size={isMobile ? "small" : "large"}
              />
              <CustomButton
                label={t("cancellation")}
                buttonType="third"
                state="default"
                size={isMobile ? "small" : "large"}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "70%",
              display: "flex",
              justifyContent: "flex-end",
              gap: 5,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <CustomTextField
              label={t("notes/name")}
              name="notes/name"
              placeholder="אבא"
              control={methods.control}
              height="29px"
            />
            <CustomTextField
              label={t("target")}
              name="target"
              placeholder="054-8494926"
              control={methods.control}
              rules={{ required: "שדה חובה" }}
              height="29px"
            />
            <CustomTextField
              label={t("directNumber")}
              name="directNumber"
              placeholder="1-973-964-0286"
              control={methods.control}
              rules={{ required: "שדה חובה" }}
              height="29px"
            />
            <CustomTextField
              label={t("number")}
              name="number"
              placeholder="1"
              control={methods.control}
              rules={{ required: "שדה חובה" }}
              height="29px"
              width="60%"
            />
          </Box>
          <CustomIconButton
            icon={<PlusIcon />}
            buttonType="third"
            state="default"
          />
        </Box>
      </form>
    </FormProvider>
  );
};

export default EditingContacts;
