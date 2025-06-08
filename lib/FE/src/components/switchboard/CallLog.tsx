import { Box } from "@mui/material";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CustomButton } from "../designComponent/Button";
import { ArrowDownOnSquareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const CallLog: React.FC = () => {
    const { t } = useTranslation();
    const { callId } = useParams();

    console.log('callId', callId);

    const downloadFile = () => {
        console.log('Downloading file...');
        
    };

    const refresh = () => {
        console.log('Refreshing...');
    };
    
    return (
        <Box sx={{
            paddingLeft: '10%',
            paddingRight: '15%',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'end',
                        gap: '10px',
                    }}>
                        <CustomTypography
                            variant="h1"
                            weight="bold"
                            text={`${t('callLog')} /`}
                        />
                        <CustomTypography
                            variant="h2"
                            weight="regular"
                            text={`${callId}`}
                        />
                    </Box>
                    {/*to do : לבדוק מאיפה מגיעים הנתונים של זה ולשנות את זה לנתונים האמיתיים אחרי קראית שרת.*/}
                    <CustomTypography
                        variant="h3"
                        weight="regular"
                        text={`${t('total')} 146 ${t('calls')} ${t('during')} 06:32:42 ${t('hours')} $3.765`}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    <CustomButton
                        label={t('downloadingFile')}
                        icon={<ArrowDownOnSquareIcon />}
                        sx={{ flexDirection: 'row-reverse' }}
                        onClick={downloadFile}
                    />
                    <CustomButton
                        label={t('refresh')}
                        icon={<ArrowPathIcon />}
                        sx={{ flexDirection: 'row-reverse' }}
                        onClick={refresh}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default CallLog;