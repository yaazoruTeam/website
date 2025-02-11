import React, { useState } from "react";
import { Box, Modal, Popover, Stack, Typography } from "@mui/material";
import { useFetchCustomers } from "./useFetchCustomers";
import { Customer } from "../../model/src";
import SelectCustomerForm from "../../stories/Form/SelectCustomerForm";
import { RecordCustomer } from "../../stories/RecordCustomer/RecordCustomer";
import { CustomButton } from "../../stories/Button/Button";
import AddCustomerForm, { AddCustomerFormInputs } from "../../stories/Form/AddCustomerForm";
import { createCustomer } from "../../api/customerApi";

interface CustomerSelectorProps {
    onCustomerSelect: (customer: Customer.Model) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ onCustomerSelect }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { customers, isLoading, error } = useFetchCustomers();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer.Model | null>(null);

    // סטייט לשליטה במודל
    const [open, setOpen] = useState<boolean>(false);

    if (isLoading) return <div>Loading customers...</div>;
    if (error) return <div>{error}</div>;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectClient = (customer: Customer.Model) => {
        setSelectedCustomer(customer);
        onCustomerSelect(customer);
        handleClose();
    };

    const isOpen = Boolean(anchorEl);






    // פונקציות לפתיחה וסגירה של המודל
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
            handleSelectClient(newCustomer);
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
            <SelectCustomerForm customer={selectedCustomer} onNameClick={handleOpen} />

            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom", // ישירות מתחת לשדה שם הלקוח
                    horizontal: "left", // יישור לשמאל
                }}
                transformOrigin={{
                    vertical: "top", // מתחיל מהחלק העליון של הרשימה
                    horizontal: "left", // יישור לשמאל
                }}
                PaperProps={{
                    sx: {
                        maxHeight: "calc(100vh - " + (anchorEl?.getBoundingClientRect().bottom || 0) + "px)",
                        overflowY: "auto",
                        boxShadow: 3,
                        borderRadius: 2,
                        padding: 0, // חשוב להסיר padding כדי להימנע מחיתוכים
                        // הוספנו עיצוב מותאם אישית עבור פס הגלילה
                        '&::-webkit-scrollbar': {
                            width: '0px', // פס גלילה דק
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0, 0, 0, 0.2)', // צבע פס הגלילה
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'transparent', // שקיפות לפס הגלילה
                        }
                    },
                }}

            >
                <Box
                    sx={{
                        width: "93%",
                        height: "100%",
                        p: 2,
                        backgroundColor: "white",
                        boxShadow: "0px 4px 10px rgba(41, 59, 109, 0.04)",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    {/* כותרת */}
                    <CustomButton label="הוספת לקוח חדש"
                        sx={{
                            background: "white",
                            color: "#032B40",
                            border: "1px rgba(11.47, 57.77, 81.74, 0.36) solid",
                            "&:hover": {
                                background: "#f9fafc",
                            },
                        }}
                        onClick={handleOpenModel}
                    />

                    {/* רשימת לקוחות */}
                    <Stack sx={{ gap: 2 }}>

                        {customers.map((customer, index) => (
                            <RecordCustomer name={`${customer.first_name} ${customer.last_name}`} phone={`${customer.phone_number}`} email={customer.email} onClick={() => handleSelectClient(customer)} />
                        ))}
                    </Stack>
                </Box>
            </Popover >





















            {/* Modal עם שקיפות */}
            <Modal
                open={open}
                onClose={handleCloseModel}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)', // הוספת אפקט של טשטוש לשקיפות
                }}
            >
                <Box
                    sx={{
                        width: 800,
                        padding: 3,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: 24,
                        textAlign: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: 6,
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-end',
                            display: 'inline-flex',
                        }}
                    >
                        <Typography variant="h6" sx={{
                            marginBottom: 2,
                            color: '#0059BA',
                            fontSize: 28,
                            fontFamily: 'Heebo',
                            fontWeight: '700',
                            wordWrap: 'break-word',
                        }}>
                            הוספת לקוח
                        </Typography>
                        <AddCustomerForm onSubmit={addCustomer} />                    </Box>

                </Box>
            </Modal>
        </>
    );
};

export default CustomerSelector;
