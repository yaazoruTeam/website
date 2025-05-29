import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Popover, Stack, useMediaQuery } from "@mui/material";
import { useFetchCustomers } from "./useFetchCustomers";
import { Customer } from "../../model/src";
import SelectCustomerForm from "./SelectCustomerForm";
import { RecordCustomer } from "../../stories/RecordCustomer/RecordCustomer";
import { CustomButton } from "../designComponent/Button";
import AddCustomerForm, { AddCustomerFormInputs } from "./AddCustomerForm";
import CustomTypography from "../designComponent/Typography";
import { colors, theme } from "../../styles/theme";
import { useTranslation } from "react-i18next";
import { addCustomer } from "./addCustomerLogic";
import CustomModal from "../designComponent/Modal";

interface CustomerSelectorProps {
    onCustomerSelect: (customer: Customer.Model) => void;
    initialCustomer?: Customer.Model;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({ onCustomerSelect, initialCustomer }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer.Model | null>(initialCustomer || null);
    const [open, setOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [allCustomers, setAllCustomers] = useState<Customer.Model[]>([]);
    const isFetchingRef = useRef(false);
    const stackRef = useRef<HTMLDivElement>(null);
    const prevScrollHeight = useRef<number>(0);


    const { customers, total, isLoading, error } = useFetchCustomers({
        page,
        filterType: searchTerm ? { type: "search", value: searchTerm } : undefined,
    });

    const hasMore = customers.length > 0 && allCustomers.length < total;

      const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        if (isLoading || isFetchingRef.current || !hasMore) return;
        const bottomReached = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
        if (bottomReached) {
            isFetchingRef.current = true;
            setPage(prev => prev + 1);
        }
    }, [isLoading, hasMore]);


     // שמירת מיקום גלילה לפני טעינת עוד לקוחות
    useEffect(() => {
        if (isFetchingRef.current && stackRef.current) {
            prevScrollHeight.current = stackRef.current.scrollHeight;
        }
    }, [isFetchingRef.current]);

     // אחרי טעינת לקוחות, החזרת הגלילה לאותו מיקום
    useEffect(() => {
        if (!isFetchingRef.current && stackRef.current && page > 1) {
            const el = stackRef.current;
            el.scrollTop = el.scrollHeight - prevScrollHeight.current;
        }
    }, [allCustomers, page]);

    useEffect(() => {
        isFetchingRef.current = false;
        if (page === 1) {
            setAllCustomers(customers); // חיפוש חדש -> איפוס
        } else {
            setAllCustomers(prev => {
                return [...prev, ...customers];
            });
        }
    }, [customers]);

    useEffect(() => {
        setSelectedCustomer(prev => {
            if (!initialCustomer || prev?.customer_id === initialCustomer.customer_id) {
                return prev;
            }
            return initialCustomer;
        });
    }, [initialCustomer]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

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

    const addNewCustomer = async (data: AddCustomerFormInputs) => {
        try {
            const newCustomer = await addCustomer(data);
            handleSelectCustomer(newCustomer);
            handleCloseModel();
        } catch (err) {
            alert(`שגיאה: ${err}`);
            handleCloseModel();
        }
    };

    return (
        <>
            <SelectCustomerForm
                customer={selectedCustomer}
                onNameClick={handleOpen}
                onNameChange={setSearchTerm}
            // searchTerm={searchTerm} 
            />

            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                keepMounted 
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
                        backgroundColor: colors.c6,
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

                    <Stack sx={{ gap: 2, overflowY: hasMore ? "auto" : "hidden", maxHeight: "60vh" }} onScroll={handleScroll} ref={stackRef}
                    >
                        {allCustomers.map((customer, index) => (
                            <RecordCustomer name={`${customer.first_name} ${customer.last_name}`} phone={`${customer.phone_number}`} email={customer.email} key={index} onClick={() => handleSelectCustomer(customer)} />
                        ))}
                    </Stack>
                    {!hasMore && (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <CustomTypography text={t("noMoreCustomers")} variant="h4" weight="regular" />
                        </Box>
                    )}
                    {/* {hasMore && (
                        <Button onClick={handleLoadMore} disabled={isLoading}>
                            {isLoading ? t("loading") : t("loadMore")}
                        </Button>
                    )} */}
                </Box>
            </Popover >
            <CustomModal open={open} onClose={handleCloseModel}>
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.c6,
                        borderRadius: 6,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        display: 'inline-flex',
                    }}
                >
                    <CustomTypography
                        text={t('addCustomer')}
                        variant='h1'
                        weight='bold'
                        color={colors.c8}
                    />
                    <AddCustomerForm onSubmit={addNewCustomer} />
                </Box>
            </CustomModal>
        </>
    );
};

export default CustomerSelector;
