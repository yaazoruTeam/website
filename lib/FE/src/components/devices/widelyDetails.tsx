import { Box } from '@mui/material'
import { useEffect, useState, Fragment, useCallback } from 'react'
import { getPackagesWithInfo, getWidelyDetails, terminateLine, resetVoicemailPincode, changePackages } from '../../api/widely'
import { Widely, WidelyDeviceDetails } from '../../model'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomSelect from '../designComponent/CustomSelect'
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
import ModelPackages from './modelPackege'


const WidelyDetails = ({ simNumber }: { simNumber: string }) => {
    const [widelyDetails, setWidelyDetails] = useState<WidelyDeviceDetails.Model | null>(null)
    const [exchangePackages, setExchangePackages] = useState<any | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetworkConnection, setSelectedNetworkConnection] = useState<string>('');
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const { t } = useTranslation()
    const [selectedPackage, setSelectedPackage] = useState<string>(widelyDetails?.package_id || "");

    // פונקציה לעיבוד אפשרויות החבילות
    const getPackageOptions = () => {
        // לפי המבנה שתיארת: packages.data.items
        const items = (exchangePackages as any)?.data?.items;
        if (!items || !Array.isArray(items)) return [];

        return items.map((pkg: any) => {
            const description = pkg.description?.EN || t('description');
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
        resetVoicemailPincode(widelyDetails?.endpoint_id || 0)
    }

    //פונקציה לשינוי תוכנית
    const handleChangePackages = async (selectedPackage: number): Promise<Widely.Model> => {
        return await changePackages(widelyDetails?.endpoint_id || 0, selectedPackage)
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

    const fetchWidelyDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const details: WidelyDeviceDetails.Model = await getWidelyDetails(simNumber);
            setWidelyDetails(details);

            // עדכון הערך בטופס
            setValue('simNumber', details.simNumber);
            // עדכון ערך החיבור הנבחר
            setSelectedNetworkConnection(details.network_connection);
            // ניתן להוסיף גם ערך ברירת מחדל לתוכנית החלפה בהתבסס על נתונים מהשרת
            // setValue('replacingPackages', details.someDefaultProgram || 'program1');
            setSelectedPackage(details.package_id || "");
            const packages = await getPackagesWithInfo();
            setExchangePackages(packages);

            // קביעת ערך ברירת מחדל לחבילות החלפה
            const items = (packages as any)?.data?.items;
            if (items && Array.isArray(items) && items.length > 0) {
                const defaultValue = items[0].id.toString();
                setValue('replacingPackages', defaultValue);
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
                <Box onClick={() => { setOpen(true); }} sx={{ cursor: 'pointer' }}>
                    <CustomTextField
                        control={control}
                        name="replacingPackages"
                        label={t('replacingPackages')}
                        disabled={true}
                        icon={<ChevronDownIcon />}

                    />
                </Box>
                <ModelPackages
                    packages={getPackageOptions()}
                    open={open}
                    close={() => setOpen(false)}
                    defaultValue={selectedPackage}
                    approval={handleChangePackages}
                />
                <CustomSelect
                    //to do:Change to add a one-time gigabyte and make a server call
                    control={control}
                    name="addOneTimeGigabyte"
                    label={t('addOneTimeGigabyte')}
                    options={[
                        { value: 'program1', label: 'תוכנית 1' },
                        { value: 'program2', label: 'תוכנית 2' },
                        { value: 'program3', label: 'תוכנית 3' }
                    ]}
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
                        onChange={(value) => setSelectedNetworkConnection(value)}
                        options={[
                            { label: t('pelephoneAndPartner'), value: 'pelephoneAndPartner' },
                            { label: t('HotAndPartner'), value: 'HotAndPartner' },
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

            {/* כפתור איפוס סיסמת תא קולי */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <CustomButton
                    label={t('resetVoicemailPincode')}
                    onClick={handleResetVoicemailPincode}
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
        </WidelyContainer>
    );
}

export default WidelyDetails
