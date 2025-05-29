import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const CallLog: React.FC = () => {
  const { t } = useTranslation();
  const { callId } = useParams();

  console.log("callId", callId);
  return <CustomTypography variant="h1" weight="bold" text={t("callLog")} />;
};

export default CallLog;