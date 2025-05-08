import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Customer, MonthlyPayment } from "../../../model";
import CustomTypography from "../../designComponent/Typography";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/theme";
import { getMonthlyPaymentByCustomerId } from "../../../api/monhlyPaymentApi";
import MonthlyPaymentList from "../../monthlyPayment/MonthlyPaymentList";

const MonthlyPaymentDetails: React.FC<{ customer: Customer.Model }> = ({ customer }) => {
    const { t } = useTranslation();
    const [monthlyPayment, setMonthlyPayment] = useState<MonthlyPayment.Model[]>([]);

    useEffect(() => {
        const getMonthlyPayments = async (customer_id: string) => {
            const monthlyPaymentData: MonthlyPayment.Model[] = await getMonthlyPaymentByCustomerId(customer_id);
            setMonthlyPayment(monthlyPaymentData);
        };
        getMonthlyPayments(customer.customer_id);
    }, [customer]);

    return (
        <Box>
            <Box sx={{
                paddingBottom: '20px'
            }}>
                <CustomTypography
                    text={t('standingOrders')}
                    variant="h1"
                    weight="bold"
                    color={colors.c11}
                />
            </Box>
            <MonthlyPaymentList monthlyPayment={monthlyPayment} isCustomerCard={true} />
        </Box>
    );
};

export default MonthlyPaymentDetails;
