import  { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CustomModal from "../designComponent/Modal";
import CustomRadioBox from "../designComponent/RadioBox";
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../designComponent/Button";

interface ModelPackagesProps {
    packages: { value: string; label: string }[];
    open: boolean;
    close: () => void;
    defaultValue?: string;
}

const ModelPackages = ({ packages, open, close, defaultValue }: ModelPackagesProps) => {
    const { t } = useTranslation();
    const [selectedPackage, setSelectedPackage] = useState<string>(defaultValue||'');

    useEffect(() => {
        setSelectedPackage(defaultValue||'');
    }, [defaultValue, open]);

    return (
        <CustomModal onClose={close} open={open} >
            <Box>
                <CustomTypography
                    text={t('choosePlan')}
                    variant="h1"
                    weight="bold"
                    color={colors.c2}
                />
                <CustomRadioBox
                    onChange={setSelectedPackage}
                    options={packages}
                    value={selectedPackage}
                />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3,
                    padding: '0 20px'
                }}>
                    <CustomButton
                        label={t('approval')}
                        buttonType="first"
                        onClick={() => { /* כאן אפשר להפעיל לוגיקה עם selectedPackage */ }}
                    />
                    <CustomButton
                        label={t('cancel')}
                        buttonType="third"
                        onClick={() => { close() }}
                    />
                </Box>
            </Box>
        </CustomModal>
    );
}

export default ModelPackages;
