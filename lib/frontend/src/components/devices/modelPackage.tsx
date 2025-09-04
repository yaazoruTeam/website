import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CustomModal from "../designComponent/Modal";
import CustomRadioBox from "../designComponent/RadioBox";
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";
import { CustomButton } from "../designComponent/Button";
import { Widely } from "@model";
import { AxiosError } from "axios";

interface ModelPackagesProps {
    packages: { value: string; label: string }[];
    open: boolean;
    close: () => void;
    defaultValue?: string;
    approval?: (selectedPackage: number) => Promise<Widely.Model>;
}

const ModelPackages = ({ packages, open, close, defaultValue, approval }: ModelPackagesProps) => {
    const { t } = useTranslation();
    const [selectedPackage, setSelectedPackage] = useState<string>(defaultValue || '');
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setSelectedPackage(defaultValue || '');
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
                {error && (
                    <CustomTypography
                    text={error}
                    variant="h4"
                    weight="bold"
                    color={colors.c28}
                />
                )}
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
                        onClick={async () => {
                            if (approval) {
                                try {
                                    const res: Widely.Model = await approval(parseInt(selectedPackage) || 0);
                                    if (res.error_code !== 200) {
                                        setError(`${t('failedToChangePackage')}: ${res.message}`  );
                                    } else {
                                        close();
                                        //to do:Adding a system message for success
                                    }
                                } catch (err: AxiosError | unknown) {
                                    setError(err instanceof AxiosError && err?.response?.data?.error || err instanceof AxiosError && err?.message || t('failedToChangePackage'));
                                    alert(`Error changing package: ${err instanceof AxiosError ? err?.response?.data?.error || err?.message : err}`);
                                }
                            }
                        }}
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
