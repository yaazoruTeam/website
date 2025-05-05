import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";
import { MonthlyPayment } from "../../model/src";
import { Link, useNavigate } from "react-router-dom";
import CustomTable from "../designComponent/CustomTable";
import { getCustomerById } from "../../api/customerApi";
import FormatDate from "../designComponent/FormatDate";
import { PencilIcon } from "@heroicons/react/24/outline";

interface MonthlyPaymentListProps {
    monthlyPayment: MonthlyPayment.Model[];
    isCustomerCard?: boolean;
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({ monthlyPayment, isCustomerCard = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [customerNames, setCustomerNames] = useState<{ [key: string]: string }>({});
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
        navigate(`/monthlyPayment/edit/${monthlyPayment.monthlyPayment_id}`, {
            state: {
                fromCustomerCard: isCustomerCard,
                customerId: monthlyPayment.customer_id
            }
        })
    }

    const columns = [
        !isCustomerCard && { label: t('customerName'), key: 'customer_name' },
        { label: t('dates'), key: 'dates' },
        { label: t('sum'), key: 'amount' },
        { label: t('total'), key: 'total_amount' },
        { label: t('belongsToAnOrganization'), key: 'belongsOrganization' },
        { label: t('lastAttempt'), key: 'last_attempt' },
        { label: t('lastSuccess'), key: 'last_sucsse' },
        { label: t('nextCharge'), key: 'next_charge' },
        { label: t('update'), key: 'update_at' },
        isCustomerCard && { label: '', key: 'updateMonthlyPayment' },
    ].filter(Boolean) as { label: string; key: string }[];;

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
        dates: <>{FormatDate({ date: payment.start_date })} - {FormatDate({ date: payment.end_date })}</>,
        amount: payment.amount,
        total_amount: payment.total_amount,
        belongsOrganization: payment.belongsOrganization,
        last_attempt: <FormatDate date={payment.last_attempt} />,
        last_sucsse: <FormatDate date={payment.last_sucsse} />,
        next_charge: <FormatDate date={payment.next_charge} />,
        update_at: <FormatDate date={payment.update_at} />,
        updateMonthlyPayment: <PencilIcon style={{ width: '24px', height: '24px', color: colors.brand.color_8, cursor: 'pointer' }} onClick={() => onClickMonthlyPayment(payment)} />
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
                    {!isCustomerCard ? <CustomTable
                        columns={columns}
                        data={tableData}
                        onRowClick={onClickMonthlyPayment}
                        showSummary={true}
                    /> :
                        <CustomTable
                            columns={columns}
                            data={tableData}
                            showSummary={false}
                        />
                    }
                </Box>
            </Box>
        </>
    );
};

export default MonthlyPaymentList;
