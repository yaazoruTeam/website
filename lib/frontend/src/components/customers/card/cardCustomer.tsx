import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Customer } from "../../../model/src";
import { deleteCustomer, getCustomerById } from "../../../api/customerApi";
import CustomTypography from "../../designComponent/Typography";
import { colors } from "../../../styles/theme";
import { Box, useMediaQuery } from "@mui/system";
import { formatDateToString } from "../../designComponent/FormatDate";
import { CustomButton } from "../../designComponent/Button";
import { TrashIcon } from '@heroicons/react/24/outline'
import CustomTabs from "../../designComponent/Tab";
import { Modal } from "@mui/material";
import CustomerDetails, { CustomerDetailsRef } from "./customerDetails";
import DeviceDetails from "./deviceDetails";


const CardCustomer: React.FC = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [customer, setCustomer] = useState<Customer.Model>();
    const isMobile = useMediaQuery('(max-width:600px)');
    const [openModal, setOpenModal] = useState(false);
    const formRef = useRef<CustomerDetailsRef>(null);

    useEffect(() => {
        const getCustomer = async (id: string) => {
            const customerData = await getCustomerById(id);
            setCustomer(customerData);
        };

        if (id) {
            getCustomer(id);
        }

    }, [id]);

    const savingChanges = () => {
        if (formRef.current) {
            formRef.current.submitForm();
            setTimeout(() => {
                const updatedCustomer = formRef.current?.getCustomerData();
                //כאן ניתן לשלוח את הנתונים לשרת
            }, 200);
        }
    };

    const deletingCustomer = async () => {
        console.log('delete customer: ', customer?.customer_id);
        if (customer)
            await deleteCustomer(parseInt(customer.customer_id))

        setOpenModal(false);
    }

    return (
        <Box
            sx={{
                direction: "rtl",
                paddingLeft: '10%',
                paddingRight: '15%',
            }}>
            <Box sx={{
                direction: 'rtl',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                marginTop: '40px'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <CustomTypography
                        text={customer ? `${customer.first_name} ${customer.last_name}` : ''}
                        variant="h1"
                        weight="bold"
                        color={colors.brand.color_9}
                    />
                    <CustomTypography
                        text={customer ? `${t('addedOn')} ${formatDateToString(new Date(Date.now()))}` : ''}
                        variant="h3"
                        weight="regular"
                        color={colors.brand.color_9}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    direction: "rtl"
                }}>
                    <CustomButton
                        label={t('deletingCustomer')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="third"
                        icon={<TrashIcon />}
                        onClick={() => setOpenModal(true)}
                    />
                    <CustomButton
                        label={t('savingChanges')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="first"
                        onClick={savingChanges}
                    />
                </Box>
            </Box>
            <Box sx={{
                marginTop: '28px'
            }}>
                <CustomTabs
                    tabs={
                        [
                            {
                                label: t('customerDetails'), content: customer ? <CustomerDetails ref={formRef} customer={customer} /> : ''
                            },
                            {
                                label: t('devicesAndQuestions'), content: customer ? <DeviceDetails customer={customer} /> : ''
                            },
                            {
                                label: t('standingOrders'), content: ''
                            },
                        ]
                    }
                />
            </Box>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: 500,
                    padding: 5,
                    background: 'white',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: 3,
                    direction: 'rtl'
                }}>
                    <Box sx={{
                        direction: 'rtl',
                        alignSelf: 'stretch',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 2
                    }}>
                        <CustomTypography
                            text={t('deletingCustomer')}
                            variant="h1"
                            weight="medium"
                            color={colors.brand.color_9}
                        />
                        <CustomTypography
                            text={t('customerDeletionWarning')}
                            variant="h3"
                            weight="medium"
                            color={colors.brand.color_9}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 2, width: '100%' }}>

                        <CustomButton
                            label={t('approval')}
                            size={isMobile ? 'small' : 'large'}
                            buttonType="first"
                            state="default"
                            onClick={deletingCustomer}
                        />
                        <CustomButton
                            label={t('cancellation')}
                            size={isMobile ? 'small' : 'large'}
                            buttonType="second"
                            state="hover"
                            onClick={() => setOpenModal(false)}
                        />
                    </Box>
                </Box>
            </Modal>
        </Box>


    );
};

export default CardCustomer;
