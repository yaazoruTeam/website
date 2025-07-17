import { Box } from '@mui/material'
import { useEffect, useState, Fragment } from 'react'
import { getPackagesWithInfo, getWidelyDetails, terminateLine, resetVoicemailPincode } from '../../api/widely'
import { WidelyDeviceDetails } from '../../model'
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

const WidelyDetails = ({ simNumber }: { simNumber: string }) => {
    const [widelyDetails, setWidelyDetails] = useState<WidelyDeviceDetails.Model | null>(null)
    const [exchangePackages, setExchangePackages] = useState<any | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetworkConnection, setSelectedNetworkConnection] = useState<string>('');
    const [isResettingPincode, setIsResettingPincode] = useState(false);
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const { t } = useTranslation()

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
        resetVoicemailPincode(400093108)
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

    useEffect(() => {
        const fetchWidelyDetails = async () => {
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

                const packages = await getPackagesWithInfo();
                console.log('Packages with info:', packages); // לוג לבדיקה
                setExchangePackages(packages);
                
                // קביעת ערך ברירת מחדל לחבילות החלפה
                const items = (packages as any)?.data?.items;
                if (items && Array.isArray(items) && items.length > 0) {
                    const defaultValue = items[0].id.toString();
                    setValue('replacingPackages', defaultValue);
                }
            } catch (err) {
                setError(t('errorLoadingDeviceDetails'));
                console.error('Error fetching widely details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWidelyDetails();
    }, [simNumber, setValue, t]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CustomTypography text={t('loading')} variant="h3" weight="medium" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <CustomTypography text={error} variant="h4" weight="medium" color={colors.c28} />
            </Box>
        );
    }

    if (!widelyDetails) {
        return (
            <Box sx={{ p: 2 }}>
                <CustomTypography text={t('noDeviceDetailsFound')} variant="h4" weight="medium" />
            </Box>
        );
    }

    return (
        <WidelyContainer>
            {/* כותרת עליונה */}
            <WidelyHeaderSection sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                
                <CustomButton
                    label={t('cancelLine')}
                    buttonType="first"
                    size="small"
                    onClick={() => setIsTerminateModalOpen(true)}
                />
            </WidelyHeaderSection>

            <WidelyFormSection>
                <CustomTextField
                    control={control}
                    name="simNumber"
                    label={t('simCurrent')}
                    disabled={true}
                />
                <CustomSelect
                    control={control}
                    name="replacingPackages"
                    label={t('replacingPackages')}
                    options={getPackageOptions()}
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

            {/* כפתור איפוס סיסמת תא קולי */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <CustomButton
                    label={t('resetVoicemailPincode')}
                    onClick={handleResetVoicemailPincode}
                    disabled={isResettingPincode || !widelyDetails?.endpoint_id}
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
