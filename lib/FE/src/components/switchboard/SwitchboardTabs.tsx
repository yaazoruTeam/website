import { Box } from "@mui/material";
import CustomTabs from "../designComponent/Tab";
import { useTranslation } from "react-i18next";
import EditingContacts from "./EditingContacts";
import CustomerForm from "../customers/customerForm";
import { colors } from "../../styles/theme";
import EditingContactsButtons from "./EditingContactsButtons";

const SwitchboardTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ paddingLeft: "10%", paddingRight: "17%" }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: colors.c6,
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          flexDirection: "column",
          p: 4,
          gap: 2,
        }}
      >
        <CustomTabs
          tabs={[
            {
              label: t("editingNumber"),
              content: <CustomerForm />,
            },
            {
              label: t("speedDial"),
              content: <EditingContacts />,
            },
          ]}
          editingContacts={true}
          sideComponent={<EditingContactsButtons />}
        />
      </Box>
    </Box>
  );
};

export default SwitchboardTabs;