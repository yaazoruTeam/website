import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { CustomButton } from "../designComponent/Button";
import AddMonthlyPayment from "./AddMonthlyPayment";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { MonthlyPayment } from "../../model/src";
import { Link, useNavigate } from "react-router-dom";
import CustomTable from "../designComponent/CustomTable";
import { getCustomerById } from "../../api/customerApi";

interface MonthlyPaymentListProps {
    monthlyPayment: MonthlyPayment.Model[];
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({ monthlyPayment }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showAddMonthlyPayment, setShowAddMonthlyPayment] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [customerNames, setCustomerNames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchCustomerNames = async () => {
            const names: { [key: string]: string } = {};
            for (const payment of monthlyPayment) {
                const customer = await getCustomerById(payment.customer_id);
                names[payment.customer_id] = `${customer.first_name} ${customer.last_name}`;
            }
            setCustomerNames(names);
        };

        fetchCustomerNames();
    }, [monthlyPayment]);

    const onClickMonthlyPayment = (monthlyPayment: MonthlyPayment.Model) => {
        console.log(monthlyPayment);
        navigate(`/monthlyPayment/edit/${monthlyPayment.monthlyPayment_id}`)
    }

    const formatDate = (date: Date | string): string => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() === 1999) {
            return '?';
        }
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const columns = [
        { label: t('customerName'), key: 'customer_name' },
        { label: t('dates'), key: 'dates' },
        { label: t('sum'), key: 'amount' },
        { label: t('total'), key: 'total_amount' },
        { label: t('belongsToAnOrganization'), key: 'belongsOrganization' },
        { label: t('lastAttempt'), key: 'last_attempt' },
        { label: t('lastSuccess'), key: 'last_sucsse' },
        { label: t('nextCharge'), key: 'next_charge' },
        { label: t('update'), key: 'update_at' },
    ];
    const tableData = monthlyPayment.map(payment => ({
        monthlyPayment_id: payment.monthlyPayment_id,
        customer_name: (
            <Link
                to={`/customer/${payment.customer_id}`}
                style={{
                    color: colors.brand.color_7,
                    cursor: 'pointer',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {customerNames[payment.customer_id] || t('loading')}
            </Link>
        ),
        dates: `${formatDate(payment.start_date)} - ${formatDate(payment.end_date)}`,
        amount: payment.amount,
        total_amount: payment.total_amount,
        belongsOrganization: payment.belongsOrganization,
        last_attempt: formatDate(payment.last_attempt),
        last_sucsse: formatDate(payment.last_sucsse),
        next_charge: formatDate(payment.next_charge),
        update_at: formatDate(payment.update_at),
    }));
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    // paddingLeft: 10,
                    // paddingRight: 10,
                    // paddingTop: 15,
                    // paddingBottom: 15,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 4,
                    direction: 'rtl'
                }}
            >
                {showAddMonthlyPayment ? (
                    <AddMonthlyPayment onBack={() => setShowAddMonthlyPayment(false)} />
                ) : (
                    <>
                        <Box sx={{
                            direction: 'rtl',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <CustomTypography
                                text={t('standingOrders')}
                                variant="h1"
                                weight="bold"
                                color={colors.brand.color_9}
                            />
                            <CustomButton
                                label={t('newStandingOrder')}
                                size={isMobile ? 'small' : 'large'}
                                state="default"
                                buttonType="first"
                                onClick={() => setShowAddMonthlyPayment(true)}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                gap: 3,
                            }}
                        >

                            <CustomTable
                                columns={columns}
                                data={tableData}
                                onRowClick={onClickMonthlyPayment}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
};

export default MonthlyPaymentList;
