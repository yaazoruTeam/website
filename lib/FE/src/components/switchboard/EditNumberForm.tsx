import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomTextField } from "../designComponent/Input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import SettingPersonalID from "./SettingPersonalID";
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";

export interface EditNumberRef {
    submitForm: () => void;
}

interface EditNumberFormInputs {
    target: string;
    notes: string;
    notifyEmailOfAllCalls: string;
    toReceiveSMSToEmail: string;

}

const EditNumberForm: React.FC<{ value: any, onChange: (data: any) => void }> = ({ value, onChange }) => {
    const { t } = useTranslation();
    const { control, watch } = useForm<EditNumberFormInputs>({
        defaultValues: value || {
            target: "",
            notes: "",
            notifyEmailOfAllCalls: "",
            toReceiveSMSToEmail: "",
        }
    });

    useEffect(() => {
        const subscription = watch((data) => {
            onChange(data);
        });

        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    const [settingPersonalID, setSettingPersonalID] = useState<boolean>(false);

    return (
        <Box>
            {settingPersonalID && <SettingPersonalID open={settingPersonalID} onClose={() => setSettingPersonalID(!settingPersonalID)} />}
            <Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '32px',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '50%',
                        gap: '30px',
                    }}>
                        <Box sx={{ width: '50%' }}>
                            <CustomTextField
                                label={t("target")}
                                name="target"
                                placeholder="1-973-964-0286"
                                control={control}
                                rules={{ required: t('requiredField') }}
                            />
                        </Box>
                        <Box sx={{ width: '50%' }}>
                            <CustomTextField
                                label={t("notes")}
                                name="notes"
                                placeholder={t("addNumber")}
                                control={control}
                                rules={{ required: t('requiredField') }}
                                sx={{ width: '393px' }}

                            />
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                        onClick={() => setSettingPersonalID(!settingPersonalID)}
                    >
                        <Box sx={{ padding: '10px' }}>
                            <Box sx={{
                                border: `1px solid ${colors.c0}`,
                                borderRadius: '4px',
                                width: '10.67px',
                                height: '10.67px',
                                backgroundColor: settingPersonalID ? colors.c3 : 'transparent',
                            }} />
                        </Box>
                        <CustomTypography
                            text={t("settingPersonalID")}
                            weight="regular"
                            variant="h4"
                        />
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '50%',
                    gap: '30px',
                    my: '24px'
                }}>
                    <CustomTextField
                        label={t("notifyEmailOfAllCalls")}
                        name="notifyEmailOfAllCalls"
                        placeholder="5869911@gmail.com
"
                        control={control}
                        rules={{ required: t('requiredField') }}
                    />
                    <CustomTextField
                        label={t("toReceiveSMSToEmail")}
                        name="toReceiveSMSToEmail"
                        placeholder="5869911@gmail.com"
                        control={control}
                        rules={{ required: t('requiredField') }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default EditNumberForm;
