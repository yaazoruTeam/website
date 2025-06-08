import React, { useState, useEffect } from "react";
import { MonthlyPayment } from "../../model/src";
import MonthlyPaymentList from "./MonthlyPaymentList";
import { getMonthlyPayment } from "../../api/monhlyPaymentApi";
import { Box } from "@mui/system";
import { CustomButton } from "../designComponent/Button";
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";
import AddMonthlyPayment from "./AddMonthlyPayment";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mui/material";

const MonthlyPaymentComponen: React.FC = () => {
    const [MonthlyPayment, setMonthlyPayment] = useState<MonthlyPayment.Model[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddMonthlyPayment, setShowAddMonthlyPayment] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const { t } = useTranslation();
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchMonthlyPayment = async () => {
            try {
                setIsLoading(true);
                const { data,total, totalPages } = await getMonthlyPayment(page);
                setMonthlyPayment(data);
                setTotal(total);
                setTotalPages(totalPages);
            } catch (err) {
                setError("Failed to fetch monthly payment.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMonthlyPayment();
    }, [page]);

    if (isLoading) return <div>Loading monthly payment...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box
            sx={{
                paddingLeft: '10%',
                paddingRight: '15%',
            }}
        >
            {showAddMonthlyPayment ? (
                <AddMonthlyPayment />
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
                            color={colors.c11}
                        />
                        <CustomButton
                            label={t('newStandingOrder')}
                            size={isMobile ? 'small' : 'large'}
                            state="default"
                            buttonType="first"
                            onClick={() => setShowAddMonthlyPayment(true)}
                        />
                    </Box>
                    <MonthlyPaymentList
                        monthlyPayment={MonthlyPayment}
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        onPageChange={setPage}
                    />
                </>
            )}
        </Box>
    );
};

export default MonthlyPaymentComponen;
