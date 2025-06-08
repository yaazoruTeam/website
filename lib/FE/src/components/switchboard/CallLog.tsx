import { Box } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import ExportCSV from "./ExportCsv";
import { useParams } from "react-router-dom";

const CallLog: React.FC = () => {
  const { t } = useTranslation();
  const { callId } = useParams();

  console.log("callId", callId);
  return (
    <Box
      sx={{
        paddingLeft: "10%",
        paddingRight: "15%",
      }}
    >
      <CustomTypography variant="h1" weight="bold" text={t("callLog")} />
      <CustomTypography variant="h1" weight="bold" text={t("callLog")} />
      <ExportCSV
        data={[
          { id: 1, name: "מיכל", callTime: "10:00 AM" },
          { id: 2, name: "אפרת", callTime: "11:00 AM" },
        ]}
        filename="call_log.csv"
      />
    </Box>
  );
};

export default CallLog;