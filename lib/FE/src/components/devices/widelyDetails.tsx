import { Box } from '@mui/material'
import { useEffect, useState, Fragment, useCallback } from 'react'
import { getWidelyDetails, terminateLine } from '../../api/widely'
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNetworkConnection, setSelectedNetworkConnection] = useState<string>('');
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const { t } = useTranslation()
    const { control, setValue } = useForm<{ simNumber: string, replacingProgram: string, addOneTimeGigabyte: string }>({
        defaultValues: {
            simNumber: simNumber,
            replacingProgram: 'program1', //to do:Change to the first value from the list returned from the server call that retrieves all the data - the list of existing programs.
            addOneTimeGigabyte: 'program1' //to do:Change to the first value from the list returned from the server call that retrieves all the data - the list of existing programs.
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

    // פונקציה לטיפול בביטול קו
    // const handleTerminateLine = async () => {
    //     if (!widelyDetails?.endpoint_id) return;
        
    //     try {
    //         setIsTerminating(true);
    //         await terminateLine(widelyDetails.endpoint_id);
    //         setIsTerminateModalOpen(false);
    //         // ניתן להוסיף הודעת הצלחה או לרענן את הנתונים
    //     } catch (err) {
    //         console.error('Error terminating line:', err);
    //         // ניתן להוסיף הודעת שגיאה
    //     } finally {
    //         setIsTerminating(false);
    //     }
    // }

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
            // setValue('replacingProgram', details.someDefaultProgram || 'program1');
        } catch (err: any) {
            // Parse error response to determine appropriate user message
            const errorMessage = err?.response?.data?.message || 
                                  err?.response?.data?.error?.message || 
                                  err?.message || '';
            
            // Set appropriate error message based on server response
            if (errorMessage === 'SIM number not found.') {
                setError(t('simNumberNotFound'));
            }
            else if (errorMessage === 'No devices found for this user.') {
                setError(t('simNumberNotFound'));
            }
            else if (errorMessage === 'Error searching for user data.') {
                setError(t('errorSearchingUserData'));
            }
            else if (errorMessage.includes('Error loading user data')) {
                setError(t('errorLoadingUserData'));
            }
            else if (errorMessage.includes('Error loading device')) {
                setError(t('errorLoadingDeviceData'));
            }
            else if (errorMessage.includes('Failed to load')) {
                setError(t('errorLoadingDeviceDetails'));
            }
            else {
                setError(t('errorLoadingDeviceDetails'));
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
        <WidelyHeaderSection sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
            <CustomButton
                label={t('refreshSIM_data')}
                size="small"
                buttonType="second"
                onClick={handleRefresh}
                disabled={loading}
                    />
                </Box>
                
                <CustomButton
                    label={t('cancelLine')}
                    buttonType="first"
                    size="small"
                    onClick={() => setIsTerminateModalOpen(true)}
            />
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
                <CustomSelect
                    control={control}
                    name="replacingProgram"
                    label={t('replacingProgram')}
                    options={[//to do:Add a call to the widely server to retrieve existing programs
                        { value: 'program1', label: 'תוכנית 1' },
                        { value: 'program2', label: 'תוכנית 2' },
                        { value: 'program3', label: 'תוכנית 3' }
                    ]}
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
