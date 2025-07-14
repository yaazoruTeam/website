import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getWidelyDetails } from '../../api/widely'
import { WidelyDeviceDetails } from '../../model'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { useTranslation } from 'react-i18next'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomSelect from '../designComponent/CustomSelect'
import CustomRadioBox from '../designComponent/RadioBox'

const WidelyDetails = ({ simNumber }: { simNumber: string }) => {
      const [widelyDetails, setWidelyDetails] = useState<WidelyDeviceDetails.Model | null>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation()
    const { control, setValue } = useForm<{ simNumber: string, replacingProgram: string, addOneTimeGigabyte: string }>({
        defaultValues: {
            simNumber: simNumber,
            replacingProgram: 'program1', // ערך ברירת מחדל
            addOneTimeGigabyte: 'program1' // ערך ברירת מחדל
        }
    })

    useEffect(() => {
        const fetchWidelyDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const details: WidelyDeviceDetails.Model = await getWidelyDetails(simNumber);
                setWidelyDetails(details);
                console.log('Widely details:', details);

                // עדכון הערך בטופס
                setValue('simNumber', details.simNumber);
                // ניתן להוסיף גם ערך ברירת מחדל לתוכנית החלפה בהתבסס על נתונים מהשרת
                // setValue('replacingProgram', details.someDefaultProgram || 'program1');
            } catch (err) {
                setError('שגיאה בטעינת פרטי המכשיר');
                console.error('Error fetching widely details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWidelyDetails();
    }, [simNumber, setValue]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CustomTypography text="טוען..." variant="h3" weight="medium" />
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
                <CustomTypography text="לא נמצאו פרטי מכשיר" variant="h4" weight="medium" />
            </Box>
        );
    }

    return (
        <Box sx={{
            p: '24px',
            direction: 'rtl',
            background: colors.c6,
            // minHeight: '100vh'
        }}>
            {/* כותרת עליונה */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: '40px'
            }}>
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

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: '40px',
            }}>

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
            </Box>
            <Box sx={{
                mb: '40px'
            }}>
                <CustomTypography
                    text={t('connection')}
                    variant="h4"
                    weight="medium"
                    color={colors.c11}
                    sx={{ mb: '16px' }}
                />
                <Box sx={{ marginLeft: '-16px' }}>
                    <CustomRadioBox
                        onChange={() => { }}
                        options={[
                            { label: t('pelephoneAndPartner'), value: 'pelephoneAndPartner' },
                            { label: t('HotAndPartner'), value: 'HotAndPartner' },
                            { label: t('pelephone'), value: 'pelephone' }
                        ]}
                        value={widelyDetails.network_connection}
                    />
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                my: '40px'
            }}>
                <Box sx={{
                }}>

                    <CustomTypography
                        text={t('gigaUsed')}
                        variant="h3"
                        weight="regular"
                        color={colors.c11}
                    />
                    <CustomTypography
                        text={`${widelyDetails.data_usage_gb}GB`}
                        variant="h3"
                        weight="bold"
                        color={colors.c11}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundColor: colors.c22,
                        width: '1px',
                        height: '26px',
                        mx: '40px'
                    }} />
                <Box>
                    <CustomTypography
                        text={t('maximumGigabytePerMonth')}
                        variant="h3"
                        weight="regular"
                        color={colors.c11}
                    />
                    <CustomTypography
                        text={`${widelyDetails.max_data_gb}GB`}
                        variant="h3"
                        weight="bold"
                        color={colors.c11}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundColor: colors.c22,
                        width: '1px',
                        height: '26px',
                        mx: '40px'
                    }} />
                <Box>
                    <CustomTypography
                        text={t('IMEI 1')}
                        variant="h3"
                        weight="regular"
                        color={colors.c11}
                    />
                    <CustomTypography
                        text={widelyDetails.imei1}
                        variant="h3"
                        weight="bold"
                        color={colors.c11}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundColor: colors.c22,
                        width: '1px',
                        height: '26px',
                        mx: '40px'
                    }} />
                <Box>
                    <CustomTypography
                        text={t('status')}
                        variant="h3"
                        weight="regular"
                        color={colors.c11}
                    />
                    <CustomTypography
                        text={widelyDetails.status}
                        variant="h3"
                        weight="bold"
                        color={colors.c11}
                    />
                </Box>
                <Box
                    sx={{
                        backgroundColor: colors.c22,
                        width: '1px',
                        height: '26px',
                        mx: '40px'
                    }} />
                <Box>
                    <CustomTypography
                        text={t('IMEI_lock')}
                        variant="h3"
                        weight="regular"
                        color={colors.c11}
                    />
                    <CustomTypography
                        text={widelyDetails.imei_lock}
                        variant="h3"
                        weight="bold"
                        color={colors.c11}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default WidelyDetails
