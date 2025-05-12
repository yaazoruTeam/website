import { Box } from "@mui/system";
import React, { useState } from "react";
import { colors } from "../../styles/theme";
import { CustomTextField } from "../designComponent/Input";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomTypography from "../designComponent/Typography";
import StatusTag from "../designComponent/Status";
import { CustomButton } from "../designComponent/Button";
import CustomSwitch from "../designComponent/Switch";
import { useMediaQuery } from "@mui/material";

export interface deviceFormInputs {
    SIM_number: string;
    IMEI_1: string;
    mehalcha_number: string;
    model: string;
    received_at: string;//להוסיף את זה לטבלה מכשירים //תאריך קבלת המכשיר
    planEndDate: string;//להוסיף את זה לטבלת מכשירים     //תאריך סיום התוכנית - 5 שנים מאז הקבלה של המכשיר
    filterVersion: string;//להוסיף את זה לטבלת מכשירים//גרסת סינון
    deviceProgram: string;//להוסיף את זה לטבלת מכשירים    //תכנית מכשיר
    notes: string;//לבדות איך בדיוק לבצע את זה!
    //הערות מכשיר

    //נתוני סים

    //פרטים שקיימים כבר על מכשיר ולא צריך אותם כאן
    // device_id: string;
    // device_number: string;
    // status: string;
    // isDonator: boolean;
}

const DeviceForm: React.FC<{ initialValues?: deviceFormInputs }> = ({ initialValues }) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width:600px)');
    const { control } = useForm<deviceFormInputs>({
        defaultValues: initialValues || {
            SIM_number: '',
            IMEI_1: '',
            mehalcha_number: '',
            model: '',
            received_at: '',
            planEndDate: '',
            filterVersion: '',
            deviceProgram: '',
            notes: ''
        }
    });
    const [isCameraAndGallery, setIsCameraAndGallery] = useState<boolean>(true);
    const [isApplications, setIsApplications] = useState<boolean>(true);
    const [isDeviceBlocked, setIsDeviceBlocked] = useState<boolean>(true);
    const [isActiveSIM, setisActiveSIM] = useState<boolean>(true);

    return (
        <Box
            sx={{
                backgroundColor: colors.c6,
                direction: 'rtl',
                padding: '28px'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: '28px',
                    paddingBottom: '24px'
                }}
            >
                <CustomTextField
                    control={control}
                    name="SIM_number"
                    label={t('SIM_number')}
                />
                <CustomTextField
                    control={control}
                    name="IMEI_1"
                    label={t('IMEI_1')}
                />
                <CustomTextField
                    control={control}
                    name="mehalcha_number"
                    label={t('mehalcha_number')}
                />
                <CustomTextField
                    control={control}
                    name="model"
                    label={t('model')}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: '28px',
                    paddingBottom: '24px'
                }}
            >
                <CustomTextField
                    control={control}
                    name="received_at"
                    label={t('dateReceiptDevice')}
                />
                <CustomTextField
                    control={control}
                    name="planEndDate"
                    label={t('programEndDate')}
                />
                <CustomTextField
                    control={control}
                    name="filterVersion"
                    label={t('filterVersion')}
                />
                <CustomTextField
                    control={control}
                    name="deviceProgram"
                    label={t('deviceProgram')}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: '28px',
                }}
            >
                <CustomTextField
                    control={control}
                    name="notes"
                    label={t('deviceNotes')}
                    placeholder={t('noCommentsYet')}
                />
            </Box>
            <Box sx={{
                paddingTop: '48px',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '16px'
                }}>
                    <CustomTypography
                        text={t('SIM_data')}
                        variant="h1"
                        weight="medium"
                        color={colors.c2}
                    />
                    <Box sx={{
                        display: 'flex',
                        gap: '4px'
                    }}>
                        <CustomTypography
                            text={t('lastUpdate')}
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                        <CustomTypography
                            text="17.02  04:17" //לשנות לפי הנתונים זה נתון ברירת חמדל לפי מה שרשום פיגמה
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    marginTop: '8px',
                    marginBottom: '48px',
                    padding: '24px',
                    backgroundColor: colors.feild,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '5px'
                        }}>
                            <CustomTypography
                                text="27.85" //לשנות לפי הנתונים זה נתון ברירת חמדל לפי מה שרשום פיגמה
                                variant="h1"
                                weight="medium"
                                color={colors.c11}
                            />
                            <CustomTypography
                                text={t('inUse')}
                                variant="h4"
                                weight="medium"
                                color={colors.c11}
                            />
                        </Box>
                        <CustomTypography
                            text="|"
                            variant="h1"
                            weight="bold"
                            color={colors.c22}
                            sx={{ mx: '20px' }}
                        />
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '5px',
                            // width: "100%",
                        }}>
                            <CustomTypography
                                text="40.00" //לשנות לפי הנתונים זה נתון ברירת חמדל לפי מה שרשום פיגמה
                                variant="h1"
                                weight="medium"
                                color={colors.c11}
                            />
                            <CustomTypography
                                text={t('maximumUtilization')}
                                variant="h4"
                                weight="medium"
                                color={colors.c11}
                            />
                        </Box>
                        <CustomTypography
                            text="|"
                            variant="h1"
                            weight="bold"
                            color={colors.c22}
                            sx={{ mx: '20px' }}
                        />
                        <Box sx={{ mx: '20px' }} >
                            <StatusTag status="imei_locked" />
                        </Box>
                    </Box>
                    <CustomButton
                        label={t("refreshSIM_data")}
                        buttonType="third"
                        state="default"
                    />
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        ml: '20px'
                    }}>
                        <CustomSwitch checked={isCameraAndGallery} onChange={() => setIsCameraAndGallery(prev => !prev)} />
                        <CustomTypography
                            text={t('cameraAndGallery')}
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        mx: '20px'
                    }}>
                        <CustomSwitch checked={isApplications} onChange={() => setIsApplications(prev => !prev)} />
                        <CustomTypography
                            text={t('applications')}
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        mx: '20px'
                    }}>
                        <CustomSwitch checked={isDeviceBlocked} onChange={() => setIsDeviceBlocked(prev => !prev)} />
                        <CustomTypography
                            text={t('deviceBlocked')}
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        mr: '20px'
                    }}>
                        <CustomSwitch checked={isActiveSIM} onChange={() => setisActiveSIM(prev => !prev)} />
                        <CustomTypography
                            text={t('activeSIM')}
                            variant="h4"
                            weight="regular"
                            color={colors.c11}
                        />
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: '40px',
                    gap: '16px'
                }}>
                    {/*צריך לדאוג להפעיל את כל הכפתורים */}
                    <CustomButton
                        label={t('One-TimeCancellationOfIMEILocks')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="third"
                    // onClick={handleSubmit(onSubmit)}
                    />
                    <CustomButton
                        label={t('disconnectingAllAntennas')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="third"
                    // onClick={handleSubmit(onSubmit)}
                    />
                    <CustomButton
                        label={t('canceLine')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="third"
                    // onClick={handleSubmit(onSubmit)}
                    />
                    <CustomButton
                        label={t('resetNetworkSettings')}
                        size={isMobile ? 'small' : 'large'}
                        state="hover"
                        buttonType="second"
                    // onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            </Box>

        </Box>
    );
};

export default DeviceForm;
