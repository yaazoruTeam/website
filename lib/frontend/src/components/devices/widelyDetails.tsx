import { Box } from '@mui/material'
import { useEffect, useState, Fragment, useCallback, useRef } from 'react'
import { getPackagesWithInfo, getWidelyDetails, terminateLine, resetVoicemailPincode, changePackages, freezeUnfreezeMobile, lockUnlockImei } from '../../api/widely'
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
import ModelPackages from './modelPackage'
import CustomSwitch from '../designComponent/Switch'


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
    const [lineSuspension, setLineSuspension] = useState<boolean>(false);
    const [isUpdatingLineSuspension, setIsUpdatingLineSuspension] = useState<boolean>(false);
    const [lineSuspensionError, setLineSuspensionError] = useState<string | null>(null);
    const isUpdatingRef = useRef(false);
    
    // IMEI Lock state
    const [imeiLocked, setImeiLocked] = useState<boolean>(false);
    const [isUpdatingImeiLock, setIsUpdatingImeiLock] = useState<boolean>(false);
    const [imeiLockError, setImeiLockError] = useState<string | null>(null);
    const isUpdatingImeiRef = useRef(false);

    // פונקציה לעיבוד אפשרויות החבילות
    const getPackageOptions = () => {
        // לפי המבנה שתיארת: packages.data.items
        const items = (exchangePackages as any)?.data?.items;
        if (!items || !Array.isArray(items)) return [];

        return items.map((pkg: any) => {
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

    //פונקציה להקפאת והפשרת מכשיר
    const handleFreezeUnFreezeMobile = async (freeze: boolean) => {
        // איפוס שגיאות קודמות
        setLineSuspensionError(null);
        console.log(freeze);
        
        // עדכון אופטימיסטי - מעדכנים את ה-state מיידית
        const previousState = lineSuspension;
        setLineSuspension(freeze);
        setIsUpdatingLineSuspension(true);
        isUpdatingRef.current = true; // עדכון ה-ref
        
        try {
            const action = freeze ? 'freeze' : 'unfreeze';
            console.log(`Freezing/unfreezing mobile with endpoint_id: ${widelyDetails?.endpoint_id || 0}, action: ${action}`);

            await freezeUnfreezeMobile(widelyDetails?.endpoint_id || 0, action);

            // הקריאה הצליחה - המצב כבר נכון במצב האופטימיסטי
            // לא צריך לקרוא ל-fetchWidelyDetails כי זה ידרוס את המצב
        } catch (error: any) {
            // במקרה של שגיאה, נחזיר את המצב הקודם
            setLineSuspension(previousState);
            
            // הצגת הודעת שגיאה מותאמת למשתמש
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               t('errorUpdatingLineSuspension');
            setLineSuspensionError(errorMessage);
            
            console.error('Error updating line suspension:', error);
        } finally {
            setIsUpdatingLineSuspension(false);
            isUpdatingRef.current = false; // איפוס ה-ref
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
        isUpdatingImeiRef.current = true; // עדכון ה-ref
        
        try {
            const response = await lockUnlockImei(widelyDetails?.endpoint_id || 0, widelyDetails?.iccid || '', lock);

            if (response.error_code !== 200) {
                throw new Error(response.message || t('errorUpdatingImeiLock'));
            }
            
            // הקריאה הצליחה - המצב כבר נכון במצב האופטימיסטי
            // לא נעשה refresh כדי לא לדרוס את השינוי
            
        } catch (error: any) {
            // במקרה של שגיאה, נחזיר את המצב הקודם
            setImeiLocked(previousState);
            
            // הצגת הודעת שגיאה מותאמת למשתמש
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               t('errorUpdatingImeiLock');
            setImeiLockError(errorMessage);
            
            console.error('Error updating IMEI lock:', error);
        } finally {
            setIsUpdatingImeiLock(false);
            isUpdatingImeiRef.current = false; // איפוס ה-ref
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
            
            // עדכון מצב ההקפאה רק אם לא במהלך עדכון אופטימיסטי
            // אם active=true אז הקו פעיל ולכן lineSuspension=false (אין השהיה)
            // אם active=false אז הקו לא פעיל ולכן lineSuspension=true (יש השהיה)
            setLineSuspension(prevState => {
                // אם כרגע עושים עדכון, לא נשנה את המצב
                if (isUpdatingRef.current) {
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
                if (isUpdatingImeiRef.current) {
                    console.log('IMEI Lock: Skipping update because currently updating');
                    return prevState;
                }
                // המרת הערך מ-string ל-boolean 
                // "Yes" (בכל צורה) = נעול, "No" = לא נעול
                const newState = details.imei_lock.startsWith("Yes");
                console.log(`IMEI Lock: Setting from server data - imei_lock: "${details.imei_lock}" -> ${newState}`);
                return newState;
            });
            
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
    }, [simNumber, setValue, t]); // הסרנו את isUpdatingLineSuspension

    const handleRefresh = () => {
        // אם במהלך עדכון של line suspension או IMEI lock, לא נבצע refresh
        if (!isUpdatingRef.current && !isUpdatingImeiRef.current) {
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
        // קוראים ל-fetchWidelyDetails רק בטעינה הראשונה, לא כאשר open משתנה
        fetchWidelyDetails();
    }, [fetchWidelyDetails]); // הסרנו את open מה-dependency array

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 2 }}>
                <CustomSwitch 
                    checked={lineSuspension} 
                    onChange={(status) => { 
                        // מסתירים שגיאה קודמת כשמתחילים פעולה חדשה
                        setLineSuspensionError(null);
                        handleFreezeUnFreezeMobile(status);
                    }} 
                    variant='modern' 
                    loading={isUpdatingLineSuspension}
                />
                <CustomTypography
                    text={t('lineIsPaused')}
                    variant="h5"
                    weight="regular"
                    color={colors.c0}
                />
            </Box>
           
            {/* הצגת הודעת שגיאה של line suspension אם יש */}
            {lineSuspensionError && (
                <Box sx={{ marginTop: 1 }}>
                    <CustomTypography
                        text={lineSuspensionError}
                        variant="h5"
                        weight="regular"
                        color={colors.c28} // צבע אדום לשגיאה
                    />
                </Box>
            )}

            {/* נעילת IMEI */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 2 }}>
                <CustomSwitch 
                    checked={imeiLocked} 
                    onChange={(status) => { 
                        // מסתירים שגיאה קודמת כשמתחילים פעולה חדשה
                        setImeiLockError(null);
                        handleLockUnlockImei(status);
                    }} 
                    variant='modern' 
                    loading={isUpdatingImeiLock}
                />
                <CustomTypography
                    text={t('imeiLock')}
                    variant="h5"
                    weight="regular"
                    color={colors.c0}
                />
            </Box>
           
            {/* הצגת הודעת שגיאה של IMEI lock אם יש */}
            {imeiLockError && (
                <Box sx={{ marginTop: 1 }}>
                    <CustomTypography
                        text={imeiLockError}
                        variant="h5"
                        weight="regular"
                        color={colors.c28} // צבע אדום לשגיאה
                    />
                </Box>
            )}
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
