import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Autocomplete, CircularProgress, useMediaQuery, Box, TextField, InputAdornment } from '@mui/material'
import { useFetchCustomers } from './useFetchCustomers'
import { Customer } from '@model'
import AddCustomerForm, { AddCustomerFormInputs } from './AddCustomerForm'
import CustomModal from '../designComponent/Modal'
import { useTranslation } from 'react-i18next'
import { addCustomer } from './addCustomerLogic'
import { useDebounce } from '../../utils/useDebounce'
import { CustomButton } from '../designComponent/Button'
import { RecordCustomer } from '../../stories/RecordCustomer/RecordCustomer'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomTypography from '../designComponent/Typography'
import { colors } from '../../styles/theme'
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

interface CustomerSelectorProps {
  onCustomerSelect: (customer: Customer.Model) => void
  initialCustomer?: Customer.Model
}

interface SelectCustomerFormInputs {
    full_name: string
    email?: string
    phone_number?: string
}
const CustomerSelector: React.FC<CustomerSelectorProps> = ({ onCustomerSelect, initialCustomer }) => {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [page, setPage] = useState(1)
    const [allCustomers, setAllCustomers] = useState<Customer.Model[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<Customer.Model | null>(initialCustomer || null)
    const [openModal, setOpenModal] = useState(false)
    const isMobile = useMediaQuery('(max-width:600px)')
    const hasMore = useRef(true)
    const loadingMoreRef = useRef(false)

    const filterType = useMemo(() => {
        return debouncedSearchTerm
            ? { type: "search", value: debouncedSearchTerm } as const
            : undefined;
    }, [debouncedSearchTerm]);

    const { customers, isLoading } = useFetchCustomers({
        page,
        filterType,
    });
    const { control } = useForm<SelectCustomerFormInputs>();
    const addNewCustomerOption = { isAddNew: true };

    const optionsWithAdd = useMemo(() => [
        addNewCustomerOption,
        ...allCustomers
    ], [allCustomers]);

    useEffect(() => {
        setAllCustomers([]);
        setPage(1);
        hasMore.current = true;
    }, [debouncedSearchTerm]);

    useEffect(() => {
        if (!customers) return
        if (customers.length === 0) {
            console.log('No more customers to load')
            if (page > 1) {
                hasMore.current = false
            }
            return
        }
        console.log('customers:', customers)


        const ids = new Set(allCustomers.map(c => c.customer_id))
        const newCustomers = customers.filter(c => !ids.has(c.customer_id))
        setAllCustomers(prev => [...prev, ...newCustomers])
        loadingMoreRef.current = false

    }, [customers])

    const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
        const listboxNode = event.currentTarget
        const bottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 100
        if (
            bottom &&
            !isLoading &&
            hasMore.current &&
            !loadingMoreRef.current
        ) {
            console.log('Loading more customers...')

            loadingMoreRef.current = true
            setPage(prev => prev + 1)
        }
    }

    const handleAddCustomer = async (data: AddCustomerFormInputs) => {
        try {
            const newCustomer = await addCustomer(data)
            setSelectedCustomer(newCustomer)
            onCustomerSelect(newCustomer)
            setOpenModal(false)
        } catch (err) {
            alert(`שגיאה: ${err}`)
            setOpenModal(false)
        }
    }
    const handleSelectCustomer = (customer: Customer.Model) => {
        setSelectedCustomer(customer)
        onCustomerSelect(customer)
    }

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    padding: 3.5,
                    backgroundColor: colors.neutral0,
                    borderRadius: 1,
                    display: 'inline-flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    gap: 3.5,
                    direction: 'rtl'
                }}
            >
                <Box sx={{
                    direction: 'rtl',
                    width: '100%'
                }}>
                    <CustomTypography
                        text={t('customerDetails')}
                        variant='h2'
                        weight='medium'
                        color={colors.blue600}
                    />

                    <Box
                        sx={{
                            width: '100%',
                            alignSelf: 'stretch',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            gap: 3.5,
                            display: 'inline-flex',
                        }}
                    >
                        <Box
                            sx={{
                                width: 393.33,
                                height: 90,
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 1,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                textAlign: 'right',
                                direction: 'rtl'
                            }}
                        >
                            <Autocomplete
                                sx={{ width: isMobile ? '100%' : 400, direction: 'rtl' }}
                                options={optionsWithAdd}
                                getOptionLabel={(option) =>
                                    'isAddNew' in option
                                        ? ''
                                        : `${option.first_name ?? ''} ${option.last_name ?? ''}`.trim()
                                }
                                value={selectedCustomer}
                                onChange={(_, value) => {
                                    if (value && 'isAddNew' in value) {
                                        setOpenModal(true)
                                        return
                                    }
                                    setSelectedCustomer(value)
                                    if (value) onCustomerSelect(value)
                                }}
                                filterOptions={(options) => options}
                                loading={isLoading}
                                loadingText={t('loading')}
                                noOptionsText={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span>{t('noCustomersFound')}</span>

                                        <CustomButton
                                            label={t('addingNewCustomer')}
                                            size={isMobile ? 'small' : 'large'}
                                            state='default'
                                            buttonType='third'
                                            sx={{
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => setOpenModal(true)}
                                        />
                                    </Box>
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        // label לא בשימוש כדי שלא יהיה label צף
                                        placeholder={t('typeCustomerName')}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {selectedCustomer
                                                        ? <InputAdornment position='end'>
                                                            <PencilSquareIcon style={{ width: 24, height: 24, color: colors.blue900 }} />
                                                        </InputAdornment>
                                                        : <InputAdornment position='end'>
                                                            <PlusCircleIcon style={{ width: 24, height: 24, color: colors.blue900 }} />
                                                        </InputAdornment>
                                                    }
                                                    {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                            disableUnderline: true,
                                            sx: {
                                                color: colors.blue900,
                                                fontSize: '16px',
                                                fontFeatureSettings:  "'/liga/' off, 'clig' off'",
                                                lineHeight: '120%',
                                                fontStyle: 'normal',
                                                fontWeight: 400,
                                                wordWrap: 'break-word',
                                                textAlign: 'right',
                                                direction: 'rtl',
                                            },
                                        }}
                                        variant='standard'
                                        fullWidth
                                        sx={{
                                            borderRadius: '6px',
                                            background: colors.fieldBg,
                                            alignSelf: 'stretch',
                                            height: '44px',
                                            width: '100%',
                                            '& .MuiInputBase-root': {
                                                height: '44px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                paddingRight: '12px',
                                                paddingLeft: '12px',
                                            },
                                            '& input': {
                                                textAlign: 'right',
                                                direction: 'rtl',
                                                padding: 0,
                                            },
                                            '@media (max-width: 600px)': {
                                                width: '100%',
                                                padding: '8px',
                                                gap: '8px',
                                            },
                                            '@media (min-width: 600px)': {
                                                width: '100%',
                                                padding: '10px',
                                            },
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => {
                                    if ('isAddNew' in option) {
                                        return (
                                            <li {...props} key='add-new-customer'>
                                                <CustomButton
                                                    label={t('addingNewCustomer')}
                                                    size={isMobile ? 'small' : 'large'}
                                                    state='default'
                                                    buttonType='third'
                                                    sx={{ justifyContent: 'center', width: '100%' }}
                                                    onClick={() => setOpenModal(true)}
                                                />
                                            </li>
                                        )
                                    }
                                    return (
                                        <li {...props} key={option.customer_id}>
                                            <RecordCustomer
                                                name={`${option.first_name} ${option.last_name}`}
                                                phone={`${option.phone_number}`}
                                                email={option.email}
                                                onClick={() => handleSelectCustomer(option)}
                                            />
                                        </li>
                                    )
                                }}
                                ListboxProps={{
                                    onScroll: handleListboxScroll,
                                    style: { maxHeight: 350, direction: 'rtl' },
                                }}
                                isOptionEqualToValue={(option, value) =>
                                    !('isAddNew' in option) &&
                                    !('isAddNew' in value) &&
                                    option.customer_id === value.customer_id
                                } clearOnBlur={false}
                                openOnFocus
                                popupIcon={null}
                                clearIcon={null}
                            />
                        </Box>
                        <Box
                            sx={{
                                width: 393.33,
                                height: 90,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                gap: 1,
                                display: 'inline-flex',
                                visibility: selectedCustomer ? 'visible' : 'hidden',
                            }}
                        >
                            <CustomTextField
                                control={control}
                                name='customerPhone'
                                label={t('phone')}
                                placeholder={selectedCustomer?.phone_number || t('phone')}
                                disabled
                            />
                        </Box>
                        <Box
                            sx={{
                                width: 393.33,
                                height: 90,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                gap: 1,
                                display: 'inline-flex',
                                visibility: selectedCustomer ? 'visible' : 'hidden',
                            }}
                        >
                            <CustomTextField
                                control={control}
                                name='customerEmail'
                                label={t('email')}
                                placeholder={selectedCustomer?.email || t('email')}
                                disabled
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <CustomModal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        width: isMobile ? '100%' : 400,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        p: 3,
                        direction: 'rtl',
                    }}
                >
                    <AddCustomerForm onSubmit={handleAddCustomer} />
                </Box>
            </CustomModal>
        </>
    )
}

export default CustomerSelector
