import React, { useMemo, useState } from "react";
import { Box, Modal, Popover, Stack, useMediaQuery } from "@mui/material";
import { useFetchCustomers } from "./useFetchCustomers";
import { Customer } from "../../model/src";
import SelectCustomerForm from "./SelectCustomerForm";
import { RecordCustomer } from "../../stories/RecordCustomer/RecordCustomer";
import { CustomButton } from "../designComponent/Button";
import AddCustomerForm, { AddCustomerFormInputs } from "./AddCustomerForm";
import { createCustomer } from "../../api/customerApi";
import CustomTypography from "../designComponent/Typography";
import { colors, theme } from "../../styles/theme";
import { useTranslation } from "react-i18next";

interface CustomerSelectorProps {
    onCustomerSelect: (customer: Customer.Model) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ onCustomerSelect }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { customers, isLoading, error } = useFetchCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer.Model | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCustomer = useMemo(() => {
        return customers.filter((customer) =>
            customer.first_name.includes(searchTerm?.toLowerCase()) ||
            customer.last_name.includes(searchTerm?.toLowerCase())
        );
    }, [searchTerm, customers]);

    if (isLoading) return <div>Loading customers...</div>;
    if (error) return <div>{error}</div>;

    const handleOpen = (event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectCustomer = (customer: Customer.Model) => {
        setSelectedCustomer(customer);
        onCustomerSelect(customer);
        handleClose();
    };

    const isOpen = Boolean(anchorEl);

    const handleOpenModel = () => setOpen(true);
    const handleCloseModel = () => setOpen(false);

    const addCustomer = async (data: AddCustomerFormInputs) => {
        console.log('add customer');
        console.log(data);
        const customerData: Customer.Model = {
            customer_id: '',
            first_name: data.first_name,
            last_name: data.last_name,
            id_number: data.id_number,
            email: data.email,
            phone_number: data.phone_number,
            additional_phone: data.additional_phone,
            city: data.city,
            address1: data.address,
            address2: '',
            zipCode: '2222',
            status: '',
        }
        try {
            const newCustomer: Customer.Model = await createCustomer(customerData);
            console.log('הלקוח נוסף בהצלחה');
            handleSelectCustomer(newCustomer);
            handleCloseModel();
        }
        catch (err: any) {
            if (err.status === 409) {
                alert(`שגיאה: מספר ת.ז או אימייל כבר קיימים`);
                //לטפל בזה שזה ישלוף ישר את המשתמש לפי הנתונים שיש לי
                handleCloseModel();

            }
            alert(`שגיאה: ${err}`);
            handleCloseModel();

            //שיהיה הודעה מסודרת ואז שהמודל יסגר...
        }

    };

    return (
        <>
            <SelectCustomerForm
                customer={selectedCustomer}
                onNameClick={handleOpen}
                onNameChange={setSearchTerm}
            />

            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                disableAutoFocus
                disableEnforceFocus
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                PaperProps={{
                    sx: {
                        maxHeight: "calc(100vh - " + (anchorEl?.getBoundingClientRect().bottom || 0) + "px)",
                        overflowY: "auto",
                        boxShadow: 3,
                        borderRadius: 2,
                        padding: 0,
                        '&::-webkit-scrollbar': {
                            width: '0px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent',
                        }
                    },
                }}
            >
                <Box
                    sx={{
                        width: "93%",
                        height: "100%",
                        p: 2,
                        backgroundColor: colors.neutral.white,
                        boxShadow: theme.shadows[0],
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <CustomButton
                        label={t('addingNewCustomer')}
                        size={isMobile ? 'small' : 'large'}
                        state="default"
                        buttonType="third"
                        sx={{
                            justifyContent: 'center'
                        }}
                        onClick={handleOpenModel}
                    />
                    <Stack sx={{ gap: 2 }}>
                        {filteredCustomer.map((customer, index) => (
                            <RecordCustomer name={`${customer.first_name} ${customer.last_name}`} phone={`${customer.phone_number}`} email={customer.email} key={index} onClick={() => handleSelectCustomer(customer)} />
                        ))}
                    </Stack>
                </Box>
            </Popover >
            <Modal
                open={open}
                onClose={handleCloseModel}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)',
                }}
            >
                <Box
                    sx={{
                        width: 800,
                        padding: 3,
                        backgroundColor: colors.neutral.white,
                        borderRadius: 2,
                        boxShadow: 24,
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: colors.neutral.white,
                            borderRadius: 6,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-end',
                            display: 'inline-flex',
                        }}
                    >
                        <CustomTypography
                            text={t('addCustomer')}
                            variant='h1'
                            weight='bold'
                            color={colors.brand.color_7}
                        />
                        <AddCustomerForm onSubmit={addCustomer} />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default CustomerSelector;
