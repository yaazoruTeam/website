import { Box, Snackbar, Alert } from '@mui/material'
import { useEffect, useState, Fragment, useCallback } from 'react'
import { getPackagesWithInfo, getWidelyDetails, resetVoicemailPincode, changePackages, sendApn, ComprehensiveResetDevice, setPreferredNetwork, addOneTimePackage, freezeUnfreezeMobile, lockUnlockImei, softResetDevice, terminateLine } from '../../api/widely'
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
const isPackagesData = (obj: unknown): obj is PackagesData => {
    return obj !== null &&
        obj !== undefined &&
        typeof obj === 'object' &&
        'data' in obj &&
        obj.data !== null &&
        typeof obj.data === 'object' &&
        'items' in obj.data &&
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
    WidelyInfoSection,
    WidelyButtonSection,
    WidelySwitchSection
} from '../designComponent/styles/widelyStyles'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import ModelPackages from './modelPackage'
import SwitchWithLoader from '../designComponent/SwitchWithLoader'
import { handleError as handleErrorUtil } from '../../utils/errorHelpers'


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
    const [lineSuspension, setLineSuspension] = useState<boolean>(false);
    const [lineSuspensionError, setLineSuspensionError] = useState<string | null>(null);
    const [isUpdatingLineSuspension, setIsUpdatingLineSuspension] = useState<boolean>(false);

    // IMEI Lock state
    const [imeiLocked, setImeiLocked] = useState<boolean>(false);
    const [imeiLockError, setImeiLockError] = useState<string | null>(null);
    const [isUpdatingImeiLock, setIsUpdatingImeiLock] = useState<boolean>(false);

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
        { title: t('status'), value: t(widelyDetails.status) },
        { title: t('IMEI_lock'), value: t(widelyDetails.imei_lock) }
    ] : []

    // עיצוב החוצץ בין הפריטים
    const separatorStyle = {
        backgroundColor: colors.blueOverlay700,
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
        return await addOneTimePackage(widelyDetails?.endpoint_id || 0, widelyDetails?.domain_user_id || 0, selectedPackage)
    }

    // פונקציה לטיפול בביטול/הפעלת קו
    const handleToggleLine = async () => {
        if (!widelyDetails?.endpoint_id) return;

        try {
            setIsTerminating(true);
            
            if (widelyDetails.active) {
                // ביטול קו - קריאה ל-terminateLine
                await terminateLine(widelyDetails.endpoint_id);
                setSuccessMessage(t('lineCancelledSuccessfully') || 'הקו בוטל בהצלחה');
            } else {
                 // הפעלת קו אינה נתמכת כרגע
                 setErrorMessage(t('activationNotSupported') || 'הפעלת קו אינה נתמכת כרגע');
                 // TODO: Implement line activation API call when available
                  return;
            }
            
            setIsTerminateModalOpen(false);
            
            // רענון הנתונים לאחר השינוי
            await fetchWidelyDetails();
        } catch (err) {
            console.error('Error toggling line:', err);
            const errorMsg = widelyDetails?.active
                ? t('errorCancellingLine') || 'שגיאה בביטול הקו'
                : t('errorActivatingLine') || 'שגיאה בהפעלת הקו';
            setErrorMessage(errorMsg);
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
        } catch (err: unknown) {
            console.error('Error in comprehensive reset:', err);
            const errorMsg = handleErrorUtil('comprehensiveReset', err, t('comprehensiveResetError'));
            setErrorMessage(`${t('comprehensiveResetFailed')}: ${errorMsg}`);
            alert(`Error in comprehensive reset: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    // פונקציה לאיפוס קל של מכשיר
    const handleSoftReset = async () => {
        if (!widelyDetails?.endpoint_id) {
            setErrorMessage(t('errorNoEndpointId'));
            return;
        }

        // בקשת אישור מהמשתמש
        const confirmed = window.confirm(
            `${t('areYouSureSoftReset')} ${widelyDetails.endpoint_id}?\n\n${t('softResetDescription')}`
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const result = await softResetDevice(widelyDetails.endpoint_id);

            if (result.error_code === 200 || result.error_code === undefined) {
                setSuccessMessage(t('softResetSuccessful'));
                // רענון הנתונים לאחר האיפוס הקל
                await fetchWidelyDetails();
            } else {
                setErrorMessage(`${t('softResetFailed')}: ${result.message || t('unknownError')}`);
            }
        } catch (err: unknown) {
            console.error('Error in soft reset:', err);
            const errorMsg = handleErrorUtil('softReset', err, t('softResetError'));
            setErrorMessage(`${t('softResetFailed')}: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    }

    //פונקציה להקפאת והפשרת מכשיר
    const handleFreezeUnFreezeMobile = async (freeze: boolean) => {
        // איפוס שגיאות קודמות
        setLineSuspensionError(null);
        console.log(freeze);

        // עדכון אופטימיסטי - מעדכנים את ה-state מיידית
        const previousState = lineSuspension;
        setLineSuspension(freeze);
        setIsUpdatingLineSuspension(true);

        try {
            const action = freeze ? 'freeze' : 'unfreeze';
            console.log(`Freezing/unfreezing mobile with endpoint_id: ${widelyDetails?.endpoint_id || 0}, action: ${action}`);

            await freezeUnfreezeMobile(widelyDetails?.endpoint_id || 0, action);

            // הקריאה הצליחה - המצב כבר נכון במצב האופטימיסטי
            // לא צריך לקרוא ל-fetchWidelyDetails כי זה ידרוס את המצב
        } catch (error: unknown) {
            // במקרה של שגיאה, נחזיר את המצב הקודם
            setLineSuspension(previousState);

            // הצגת הודעת שגיאה מותאמת למשתמש
            const errorMessage = handleErrorUtil('freezeUnfreezeMobile', error, t('errorUpdatingLineSuspension'));

            setLineSuspensionError(errorMessage);

            console.error('Error updating line suspension:', error);
        } finally {
            setIsUpdatingLineSuspension(false);
        }
    }

    //פונקציה לנעילת ושחרור IMEI
    const handleLockUnlockImei = async (lock: boolean) => {
        // איפוס שגיאות קודמות
        setImeiLockError(null);
        console.log(`IMEI Lock: Setting to ${lock}, endpoint_id: ${widelyDetails?.endpoint_id}, iccid: ${widelyDetails?.iccid}`);

        // עדכון אופטימיסטי - מעדכנים את ה-state מיידית
        const previousState = imeiLocked;
        setImeiLocked(lock);
        setIsUpdatingImeiLock(true);

        try {
            const response = await lockUnlockImei(widelyDetails?.endpoint_id || 0, widelyDetails?.iccid || '', lock);

            if (response.error_code !== 200) {
                throw new Error(response.message || t('errorUpdatingImeiLock'));
            }

            // הקריאה הצליחה - המצב כבר נכון במצב האופטימיסטי
            // לא נעשה refresh כדי לא לדרוס את השינוי

        } catch (error: unknown) {
            // במקרה של שגיאה, נחזיר את המצב הקודם
            setImeiLocked(previousState);

            // הצגת הודעת שגיאה מותאמת למשתמש
            const errorMessage = handleErrorUtil('lockUnlockImei', error, t('errorUpdatingImeiLock'));

            setImeiLockError(errorMessage);

            console.error('Error updating IMEI lock:', error);
        } finally {
            setIsUpdatingImeiLock(false);
        }
    }

    // Helper function to parse IMEI lock status
    const parseImeiLockStatus = (status: string): boolean => {
        if (!status || typeof status !== 'string') {
            return false;
        }

        const normalizedStatus = status.toLowerCase().trim();

        // Handle various positive responses
        const positiveValues = ['yes', 'true', '1', 'locked', 'enabled', 'active'];

        return positiveValues.some(value => normalizedStatus.startsWith(value));
    };

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



            // עדכון מצב ההקפאה רק אם לא במהלך עדכון אופטימיסטי
            // אם active=true אז הקו פעיל ולכן lineSuspension=false (אין השהיה)
            // אם active=false אז הקו לא פעיל ולכן lineSuspension=true (יש השהיה)
            setLineSuspension(prevState => {
                // אם כרגע עושים עדכון, לא נשנה את המצב
                if (isUpdatingLineSuspension) {
                    console.log('Line Suspension: Skipping update because currently updating');
                    return prevState;
                }
                const newState = !details.active; // הפוך מ-active
                console.log(`Line Suspension: Setting from server data - active: ${details.active} -> lineSuspension: ${newState}`);
                return newState;
            });

            // עדכון מצב נעילת IMEI רק אם לא במהלך עדכון אופטימיסטי
            setImeiLocked(prevState => {
                // אם כרגע עושים עדכון, לא נשנה את המצב
                if (isUpdatingImeiLock) {
                    console.log('IMEI Lock: Skipping update because currently updating');
                    return prevState;
                }
                // המרת הערך מ-string ל-boolean בצורה יותר חזקה
                const newState = parseImeiLockStatus(details.imei_lock);
                console.log(`IMEI Lock: Setting from server data - imei_lock: "${details.imei_lock}" -> ${newState}`);
                return newState;
            });

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
        } catch (err: unknown) {
            // Parse error response to determine appropriate user message
            const errorMessage = handleErrorUtil('fetchWidelyDetails', err, t('errorLoadingsimDetails'));

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
                { test: msg => msg.includes('Failed to load'), key: 'errorLoadingsimDetails' }
            ]

            // 🧠 ראשית נבדוק האם ההודעה היא בדיוק אחת מהשגיאות הידועות
            if (exactMatchErrors[errorMessage]) {
                setError(t(exactMatchErrors[errorMessage]));
            } else {
                // אם לא – ננסה לזהות בהתבסס על תוכן הודעת השגיאה
                const match = partialMatchErrors.find(({ test }) => test(errorMessage));
                setError(t(match?.key || 'errorLoadingsimDetails'));
            }

        } finally {
            setLoading(false);
        }
    }, [simNumber, setValue, t, isUpdatingLineSuspension, isUpdatingImeiLock]);

    const handleRefresh = () => {
        // אם במהלך עדכון של line suspension או IMEI lock, לא נבצע refresh
        if (!isUpdatingLineSuspension && !isUpdatingImeiLock) {
            fetchWidelyDetails();
        }
    };

    // Component for reusable header section
    const HeaderSection = () => (
        <WidelyHeaderSection sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box display="flex" alignItems="center" gap="4px">
                <CustomTypography
                    text={t('simData')}
                    variant="h3"
                    weight="medium"
                    color={colors.blue900}
                />
                <CustomTypography
                    text={simNumber}
                    variant="h4"
                    weight="regular"
                    color={colors.blue900}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CustomButton
                    label={widelyDetails?.active ? t('cancelLine') : t('activateLine')}
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
                    color={colors.blue900}
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
                                color={colors.blue900}
                            />
                            <CustomTypography
                                text={item.value}
                                variant="h3"
                                weight="bold"
                                color={colors.blue900}
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
        // קוראים ל-fetchWidelyDetails רק בטעינה הראשונה, לא כאשר open משתנה
        fetchWidelyDetails();
    }, [fetchWidelyDetails]);

    if (error) {
        return (
            <WidelyContainer>
                <HeaderSection />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CustomTypography text={error} variant="h4" weight="medium" color={colors.red500} />
                </Box>
            </WidelyContainer>
        );
    }

    return (
        <WidelyContainer>
            <HeaderSection />
            {renderContent()}

            {/* כפתור איפוס סיסמת תא קולי */}
            <WidelyButtonSection>
                <CustomButton
                    label={t('softReset')}
                    onClick={handleSoftReset}
                    buttonType="fourth"
                    size="large"
                />
                <CustomButton
                    label={t('comprehensiveReset')}
                    onClick={handleComprehensiveReset}
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
                    label={t('resetVoicemailPincode')}
                    onClick={handleResetVoicemailPincode}
                    buttonType="fourth"
                    size="large"
                />




                {/* מתגים להקפאה ונעילת IMEI */}
                <WidelySwitchSection>
                    {/* הקפאה/הפשרה של קו */}
                    <SwitchWithLoader
                        checked={lineSuspension}
                        onChange={(status) => {
                            // מסתירים שגיאה קודמת כשמתחילים פעולה חדשה
                            setLineSuspensionError(null);
                            handleFreezeUnFreezeMobile(status);
                        }}
                        variant='modern'
                        loading={isUpdatingLineSuspension}
                        label={t('lineIsPaused')}
                        error={lineSuspensionError}
                    />

                    {/* נעילת IMEI */}
                    <SwitchWithLoader
                        checked={imeiLocked}
                        onChange={(status) => {
                            // מסתירים שגיאה קודמת כשמתחילים פעולה חדשה
                            setImeiLockError(null);
                            handleLockUnlockImei(status);
                        }}
                        variant='modern'
                        loading={isUpdatingImeiLock}
                        label={t('imeiLock')}
                        error={imeiLockError}
                    />
                </WidelySwitchSection>
            </WidelyButtonSection>


            {/* מודל אישור ביטול קו */}
            <CustomModal
                open={isTerminateModalOpen}
                onClose={() => setIsTerminateModalOpen(false)}
            // maxWidth={400}
            >
                {/* <Box sx={{ textAlign: 'center', padding: 2 }}> */}
                <CustomTypography
                    text={widelyDetails?.active ? t('cancelLine') : t('activateLine')}
                    variant="h1"
                    weight="medium"
                    color={colors.blue900}
                    sx={{ marginBottom: 3 }}
                />

                <CustomTypography
                    text={widelyDetails?.active ? t('areYouSureYouWantToCancelTheLine') : t('areYouSureYouWantToActivateTheLine')}
                    variant="h3"
                    weight="regular"
                    color={colors.blue900}
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
                        onClick={handleToggleLine}
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
