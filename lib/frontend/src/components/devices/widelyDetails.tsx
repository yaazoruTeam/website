import { Box, Snackbar, Alert } from '@mui/material'
import { useEffect, useState, Fragment, useCallback } from 'react'
import { getPackagesWithInfo, getWidelyDetails, terminateLine, resetVoicemailPincode, changePackages, sendApn, ComprehensiveResetDevice, setPreferredNetwork, addOneTimePackage } from '../../api/widely'
import { Widely, WidelyDeviceDetails } from '@model'
import CustomTypography from '../designComponent/Typography'

// Interface עבור פריט חבילה בודד
interface PackageItem {
    id: number
    description?: {
        EN?: string
        HE?: string
    }
    price?: number
}

// Interface עבור מבנה הנתונים של החבילות
interface PackagesData {
    data: {
        items: PackageItem[]
    }
}

// Type guard לבדיקת מבנה החבילות
const isPackagesData = (obj: any): obj is PackagesData => {
    return obj && 
           typeof obj.data === 'object' && 
           Array.isArray(obj.data.items);
}
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomRadioBox from '../designComponent/RadioBox'
import { CustomButton } from '../designComponent/Button'
import CustomModal from '../designComponent/Modal'
import {
    WidelyContainer,
    WidelyHeaderSection,
    WidelyFormSection,
    WidelyConnectionSection,
    WidelyInfoSection
} from '../designComponent/styles/widelyStyles'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import ModelPackages from './modelPackage'


const WidelyDetails = ({ simNumber }: { simNumber: string }) => {
    const [widelyDetails, setWidelyDetails] = useState<WidelyDeviceDetails.Model | null>(null)
    const [basePackages, setBasePackages] = useState<PackagesData | null>(null)
    const [extraPackages, setExtraPackages] = useState<PackagesData | null>(null)

    const [openBasePackagesModel, setOpenBasePackagesModel] = useState<boolean>(false)
    const [openExtraPackagesModel, setOpenExtraPackagesModel] = useState<boolean>(false)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetworkConnection, setSelectedNetworkConnection] = useState<string>('');
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation()
    const [selectedPackage, setSelectedPackage] = useState<string>(widelyDetails?.package_id || "");

    // פונקציה לעיבוד אפשרויות החבילות
    const getPackageOptions = (packages: PackagesData | null) => {
        // לפי המבנה שתיארת: packages.data.items
        const items = packages?.data?.items;
        if (!items || !Array.isArray(items)) return [];

        return items.map((pkg: PackageItem) => {
            const description = pkg.description?.EN || t('noDescriptionAvailable');
            const price = pkg.price || 0;

            // בניית הלייבל בפורמט: "תיאור - מחיר₪ לחודש"
            const label = `${description} - ${price}₪ ${t('perMonth')}`;

            return {
                value: pkg.id.toString(),
                label: label
            };
        });
    };
    const { control, setValue } = useForm<{ simNumber: string, replacingPackages: string, addOneTimeGigabyte: string }>({
        defaultValues: {
            simNumber: simNumber,
            replacingPackages: '',
            addOneTimeGigabyte: ''
        }
    })

    // נתוני המידע שיוצגו בשורה התחתונה
    const infoItems = widelyDetails ? [
        { title: t('gigaUsed'), value: `${widelyDetails.data_usage_gb}GB` },
        { title: t('maximumGigabytePerMonth'), value: `${widelyDetails.max_data_gb}GB` },
        { title: t('IMEI 1'), value: widelyDetails.imei1 },
        { title: t('status'), value: widelyDetails.status },
        { title: t('IMEI_lock'), value: widelyDetails.imei_lock }
    ] : []

    // עיצוב החוצץ בין הפריטים
    const separatorStyle = {
        backgroundColor: colors.c22,
        width: '1px',
        height: '26px',
        mx: '40px'
    }

    // פונקציה לאיפוס סיסמת תא קולי
    const handleResetVoicemailPincode = async () => {
        try {
            await resetVoicemailPincode(widelyDetails?.endpoint_id || 0);
            setSuccessMessage(t('voicemailPincodeResetSuccessfully'));
        } catch (err) {
            console.error('Error resetting voicemail pincode:', err);
            setErrorMessage(t('errorResettingVoicemailPincode'));
        }
    }

    const handleChangeNetworkConnection = async (network_connection: 'Pelephone_and_Partner' | 'Hot_and_Partner' | 'pelephone') => {
        try {
            await setPreferredNetwork(widelyDetails?.endpoint_id || 0, network_connection);
            await fetchWidelyDetails(); // רענון הנתונים לאחר השינוי
            setSuccessMessage(t('preferredNetworkChangedSuccessfully'));
        } catch (error) {
            console.error('Error setting preferred network:', error);
            setErrorMessage(t('errorSettingPreferredNetwork'));
        }
    }

    //פונקציה לשינוי תוכנית
    const handleChangePackages = async (selectedPackage: number): Promise<Widely.Model> => {
        return await changePackages(widelyDetails?.endpoint_id || 0, selectedPackage)
    }

    const handleSendApn = async () => {
        if (widelyDetails && widelyDetails.endpoint_id) {
            try {
                await sendApn(widelyDetails.endpoint_id);
                setSuccessMessage(t('apnSentSuccessfully'));
            } catch (err) {
                console.error('Error sending APN:', err);
                setErrorMessage(t('errorSendingApn'));
            }
        } else {
            console.error('Error: endpoint_id is missing or widelyDetails is null');
            setErrorMessage(t('errorSendingApn'));
        }
    }

     //פונקציה להוספת חבילת גיגה חד פעמית
    const handleAddOneTimeGigabyte = async (selectedPackage: number): Promise<Widely.Model> => {
        return await addOneTimePackage(widelyDetails?.endpoint_id || 0,widelyDetails?.domain_user_id || 0, selectedPackage)
    }

    // פונקציה לטיפול בביטול קו
    const handleTerminateLine = async () => {
        if (!widelyDetails?.endpoint_id) return;

        try {
            setIsTerminating(true);
            await terminateLine(widelyDetails.endpoint_id);
            setIsTerminateModalOpen(false);
            // ניתן להוסיף הודעת הצלחה או לרענן את הנתונים
        } catch (err) {
            console.error('Error terminating line:', err);
            // ניתן להוסיף הודעת שגיאה
        } finally {
            setIsTerminating(false);
        }
    }

    // פונקציה לאיפוס מקיף של מכשיר
    const handleComprehensiveReset = async () => {
        if (!widelyDetails?.endpoint_id) {
            setErrorMessage(t('errorNoEndpointId'));
            return;
        }

        // בקשת אישור מהמשתמש
        const confirmed = window.confirm(
            `${t('areYouSureComprehensiveReset')} ${widelyDetails.endpoint_id}?\n\n${t('warningComprehensiveReset')}`
        );

        if (!confirmed) return;

        // בקשת שם למכשיר החדש
        const deviceName = window.prompt(t('enterNewDeviceName'), `Reset_${widelyDetails.endpoint_id}_${new Date().toISOString().split('T')[0]}`);

        if (!deviceName) {
            setErrorMessage(t('deviceNameRequired'));
            return;
        }

        try {
            setLoading(true);
            const result = await ComprehensiveResetDevice(widelyDetails.endpoint_id, deviceName);

            if (result.success) {
                setSuccessMessage(
                    `${t('comprehensiveResetSuccess')}\n${t('newEndpointId')}: ${result.data.newEndpointId}`
                );
                // רענון הנתונים לאחר איפוס מוצלח
                setTimeout(() => {
                    fetchWidelyDetails();
                }, 2000);
            } else {
                setErrorMessage(`${t('comprehensiveResetFailed')}: ${result.message}`);
            }
        } catch (err: any) {
            console.error('Error in comprehensive reset:', err);
            const errorMsg = err?.response?.data?.message || err?.message || t('comprehensiveResetError');
            setErrorMessage(`${t('comprehensiveResetFailed')}: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    const fetchWidelyDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const details: WidelyDeviceDetails.Model = await getWidelyDetails(simNumber);
            setWidelyDetails(details);

            // עדכון הערך בטופס
            setValue('simNumber', details.simNumber);
            // עדכון ערך החיבור הנבחר
            console.log('Network connection:', details.network_connection);
            switch (details.network_connection) {
                case 'PHI':
                    setSelectedNetworkConnection('Hot_and_Partner');
                    break;
                case 'PL':
                    setSelectedNetworkConnection('Pelephone_and_Partner');
                    break;
                //to do : Check how to make sure it's just a pelephon 
                default:
                    setSelectedNetworkConnection('');
                    break;
            }
            // ניתן להוסיף גם ערך ברירת מחדל לתוכנית החלפה בהתבסס על נתונים מהשרת
            // setValue('replacingPackages', details.someDefaultProgram || 'program1');
            setSelectedPackage(details.package_id || "");
            const basePackages = await getPackagesWithInfo('base');
            const extraPackages = await getPackagesWithInfo('extra');

            // בדיקה ושמירה בטוחה של החבילות
            if (isPackagesData(extraPackages)) {
                setExtraPackages(extraPackages);
            }
            if (isPackagesData(basePackages)) {
                setBasePackages(basePackages);
            }



            // קביעת ערך ברירת מחדל לחבילות החלפה
            if (isPackagesData(basePackages)) {
                const baseItems = basePackages.data.items;
                if (baseItems && Array.isArray(baseItems) && baseItems.length > 0) {
                    const defaultValue = baseItems[0].id.toString();
                    setValue('replacingPackages', defaultValue);
                }
            }

            if (isPackagesData(extraPackages)) {
                const extraItems = extraPackages.data.items;
                if (extraItems && Array.isArray(extraItems) && extraItems.length > 0) {
                    const defaultValue = extraItems[0].id.toString();
                    setValue('addOneTimeGigabyte', defaultValue);
                }
            }
        } catch (err: any) {
            // Parse error response to determine appropriate user message
            const errorMessage = err?.response?.data?.message ||
                err?.response?.data?.error?.message ||
                err?.message || '';
            // 🔁 שדרוג: טיפול בשגיאות באמצעות Map
            const exactMatchErrors: Record<string, string> = {
                'SIM number not found.': 'simNumberNotFound',
                'No devices found for this user.': 'simNumberNotFound',
                'Multiple SIM numbers found - please provide more specific SIM number.': 'multipleSIMNumbersFound',
                'Error searching for user data.': 'errorSearchingUserData'
            }

            const partialMatchErrors: { test: (msg: string) => boolean; key: string }[] = [
                { test: msg => msg.includes('Error loading user data'), key: 'errorLoadingUserData' },
                { test: msg => msg.includes('Error loading device'), key: 'errorLoadingDeviceData' },
                { test: msg => msg.includes('Failed to load'), key: 'errorLoadingDeviceDetails' }
            ]

            // 🧠 ראשית נבדוק האם ההודעה היא בדיוק אחת מהשגיאות הידועות
            if (exactMatchErrors[errorMessage]) {
                setError(t(exactMatchErrors[errorMessage]));
            } else {
                // אם לא – ננסה לזהות בהתבסס על תוכן הודעת השגיאה
                const match = partialMatchErrors.find(({ test }) => test(errorMessage));
                setError(t(match?.key || 'errorLoadingDeviceDetails'));
            }

        } finally {
            setLoading(false);
        }
    }, [simNumber, setValue, t]);

    const handleRefresh = () => {
        fetchWidelyDetails();
    };

    // Component for reusable header section
    const HeaderSection = () => (
        <WidelyHeaderSection sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap="4px">
                <CustomTypography
                    text={t('simData')}
                    variant="h3"
                    weight="medium"
                    color={colors.c11}
                />
                <CustomTypography
                    text={simNumber}
                    variant="h4"
                    weight="regular"
                    color={colors.c11}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CustomButton
                    label={t('cancelLine')}
                    buttonType="first"
                    size="small"
                    onClick={() => setIsTerminateModalOpen(true)}
                />
                <CustomButton
                    label={t('refreshSIM_data')}
                    size="small"
                    buttonType="second"
                    onClick={handleRefresh}
                    disabled={loading}
                />
            </Box>
        </WidelyHeaderSection>
    );

    // רנדור מצב טעינה
    const renderLoadingState = () => (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CustomTypography text={t('loading')} variant="h3" weight="medium" />
        </Box>
    );

    // רנדור כשאין נתונים
    const renderNoDataState = () => (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CustomTypography text={t('noDeviceDetailsFound')} variant="h4" weight="medium" />
        </Box>
    );

    // רנדור תוכן הנתונים הראשי
    const renderMainContent = () => (
        <>
            <WidelyFormSection>
                <CustomTextField
                    control={control}
                    name="simNumber"
                    label={t('simCurrent')}
                    disabled={true}
                />
                <Box onClick={() => { setOpenBasePackagesModel(true); }} sx={{ cursor: 'pointer' }}>
                    <CustomTextField
                        control={control}
                        name="replacingPackages"
                        label={t('replacingPackages')}
                        disabled={true}
                        icon={<ChevronDownIcon />}

                    />
                </Box>
                <ModelPackages
                    packages={getPackageOptions(basePackages)}
                    open={openBasePackagesModel}
                    close={() => setOpenBasePackagesModel(false)}
                    defaultValue={selectedPackage}
                    approval={handleChangePackages}
                />
                <Box onClick={() => { setOpenExtraPackagesModel(true); }} sx={{ cursor: 'pointer' }}>
                    <CustomTextField
                        control={control}
                        name="addOneTimeGigabyte"
                        label={t('addOneTimeGigabyte')}
                        disabled={true}
                        icon={<ChevronDownIcon />}
                    />
                </Box>
                <ModelPackages
                    packages={getPackageOptions(extraPackages)}
                    open={openExtraPackagesModel}
                    close={() => setOpenExtraPackagesModel(false)}
                    defaultValue={selectedPackage}
                    approval={async (selectedPackage: number) => handleAddOneTimeGigabyte(selectedPackage)}
                />
            </WidelyFormSection>

            <WidelyConnectionSection>
                <CustomTypography
                    text={t('connection')}
                    variant="h4"
                    weight="medium"
                    color={colors.c11}
                />
                <Box>
                    <CustomRadioBox
                        onChange={(value) => handleChangeNetworkConnection(value as 'Pelephone_and_Partner' | 'Hot_and_Partner' | 'pelephone')}
                        options={[
                            { label: t('pelephoneAndPartner'), value: 'Pelephone_and_Partner' },
                            { label: t('HotAndPartner'), value: 'Hot_and_Partner' },
                            { label: t('pelephone'), value: 'pelephone' }
                        ]}
                        value={selectedNetworkConnection}
                    />
                </Box>
            </WidelyConnectionSection>

            <WidelyInfoSection>
                {infoItems.map((item, index) => (
                    <Fragment key={index}>
                        <Box>
                            <CustomTypography
                                text={item.title}
                                variant="h3"
                                weight="regular"
                                color={colors.c11}
                            />
                            <CustomTypography
                                text={item.value}
                                variant="h3"
                                weight="bold"
                                color={colors.c11}
                            />
                        </Box>
                        {index < infoItems.length - 1 && (
                            <Box sx={separatorStyle} />
                        )}
                    </Fragment>
                ))}
            </WidelyInfoSection>
        </>
    );

    // קביעת מה לרנדר בהתבסס על המצב הנוכחי
    const renderContent = () => {
        if (loading && !widelyDetails) {
            return renderLoadingState();
        }

        if (widelyDetails) {
            return renderMainContent();
        }

        return renderNoDataState();
    };

    useEffect(() => {
        fetchWidelyDetails();
    }, [fetchWidelyDetails]);

    if (error) {
        return (
            <WidelyContainer>
                <HeaderSection />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CustomTypography text={error} variant="h4" weight="medium" color={colors.c28} />
                </Box>
            </WidelyContainer>
        );
    }

    return (
        <WidelyContainer>
            <HeaderSection />
            {renderContent()}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <CustomButton
                    label={t('resetVoicemailPincode')}
                    onClick={handleResetVoicemailPincode}
                    buttonType="fourth"
                    size="large"
                />
                <CustomButton
                    label={t('sendApn')}
                    onClick={handleSendApn}
                    buttonType="fourth"
                    size="large"
                />
                <CustomButton
                    label={t('comprehensiveReset')}
                    onClick={handleComprehensiveReset}
                    buttonType="fourth"
                    size="large"
                />
            </Box>
            {/* מודל אישור ביטול קו */}
            <CustomModal
                open={isTerminateModalOpen}
                onClose={() => setIsTerminateModalOpen(false)}
            // maxWidth={400}
            >
                {/* <Box sx={{ textAlign: 'center', padding: 2 }}> */}
                <CustomTypography
                    text={t('cancelLine')}
                    variant="h1"
                    weight="medium"
                    color={colors.c11}
                    sx={{ marginBottom: 3 }}
                />

                <CustomTypography
                    text={t('areYouSureYouWantToCancelTheLine')}
                    variant="h3"
                    weight="regular"
                    color={colors.c11}
                    sx={{ marginBottom: 4 }}
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <CustomButton
                        label={t('cancel')}
                        buttonType="first"
                        size="small"
                        onClick={() => setIsTerminateModalOpen(false)}
                    />
                    <CustomButton
                        label={t('confirm')}
                        buttonType="third"
                        size="small"
                        onClick={handleTerminateLine}
                        disabled={isTerminating}
                    />
                </Box>
                {/* </Box> */}
            </CustomModal>

            {/* הודעות הצלחה וכישלון */}
            <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
                <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
                <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </WidelyContainer>
    );
}

export default WidelyDetails
