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
import FormatDate from "../designComponent/FormatDate";

interface MonthlyPaymentListProps {
    monthlyPayment: MonthlyPayment.Model[];
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({ monthlyPayment }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showAddMonthlyPayment, setShowAddMonthlyPayment] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [customerData, setCustomerData] = useState<{ [key: string]: { name: string, id: string } }>({});
    const [searchCustomer, setSearchCustomer] = useState<string>('');
    const [filteredPayments, setFilteredPayments] = useState<MonthlyPayment.Model[]>(monthlyPayment);

    useEffect(() => {
        const fetchCustomerNames = async () => {
            const data: { [key: string]: { name: string, id: string } } = {};
            for (const payment of monthlyPayment) {
                const customer = await getCustomerById(payment.customer_id);
                data[payment.customer_id] = {
                    name: `${customer.first_name} ${customer.last_name}`,
                    id: customer.id_number,
                };
            }
            setCustomerData(data);
        };

        fetchCustomerNames();
    }, [monthlyPayment]);

    useEffect(() => {
        const lowerSearch = searchCustomer.toLowerCase().trim();
        if (!lowerSearch) {
            setFilteredPayments(monthlyPayment);
            return;
        }

        const filtered = monthlyPayment.filter(payment => {
            const customer = customerData[payment.customer_id];
            if (!customer) return false;
            return (
                customer.name.toLowerCase().includes(lowerSearch) ||
                (typeof customer.id === "string" && customer.id.includes(lowerSearch))
            );
        });

        setFilteredPayments(filtered);
    }, [searchCustomer, monthlyPayment, customerData]);

    const onClickMonthlyPayment = (monthlyPayment: MonthlyPayment.Model) => {
        console.log(monthlyPayment);
        navigate(`/monthlyPayment/edit/${monthlyPayment.monthlyPayment_id}`)
    }

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

    const tableData = filteredPayments.map(payment => {
        const customer = customerData[payment.customer_id];
        return {
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
                    {customer && customer.name ? customer.name : t('customerNotFound')} {/* אם הלקוח קיים, הצג את שמו, אחרת הצג הודעת שגיאה */}
                </Link>
            ),
            dates: <>{FormatDate({ date: payment.start_date })} - {FormatDate({ date: payment.end_date })}</>,
            amount: payment.amount,
            total_amount: payment.total_amount,
            belongsOrganization: payment.belongsOrganization,
            last_attempt: <FormatDate date={payment.last_attempt} />,
            last_sucsse: <FormatDate date={payment.last_sucsse} />,
            next_charge: <FormatDate date={payment.next_charge} />,
            update_at: <FormatDate date={payment.update_at} />,
        }
    });

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
                            <input onChange={(e) => setSearchCustomer(e.target.value)} />
                            <CustomTable
                                columns={columns}
                                data={tableData}
                                onRowClick={onClickMonthlyPayment}
                                showSummary={true}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
};

export default MonthlyPaymentList;
