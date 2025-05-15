import { Box } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";

const CallLog: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{
            paddingLeft: '10%',
            paddingRight: '15%',
        }}>
            <CustomTypography
                variant="h1"
                weight="bold"
                text={t('callLog')}
            />
        </Box>
    );
}

export default CallLog;