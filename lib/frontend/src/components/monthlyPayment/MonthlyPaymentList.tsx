import React, { useState } from "react";
import { Button, Box, useMediaQuery } from "@mui/material";
import { CustomButton } from "../designComponent/Button";
import AddMonthlyPayment from "./AddMonthlyPayment";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";
import { useTranslation } from "react-i18next";

interface MonthlyPaymentListProps {
    monthlyPayment: string[];
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({ monthlyPayment }) => {
      const { t } = useTranslation();
    const [showAddMonthlyPayment, setShowAddMonthlyPayment] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "50%",
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
                }}
            >
                {showAddMonthlyPayment ? (
                    <AddMonthlyPayment onBack={() => setShowAddMonthlyPayment(false)} />
                ) : (
                    <>
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
                            onClick={() => setShowAddMonthlyPayment(true)} />
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
                            {monthlyPayment.map((monthlyPayment, index) => (
                                <Button
                                    key={index}
                                    sx={{
                                        width: '100%',
                                        height: 81,
                                        paddingLeft: 3,
                                        paddingRight: 3,
                                        backgroundColor: colors.neutral.white,
                                        borderRadius: 1,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        gap: 3,
                                        textTransform: "none",
                                        border: "none",
                                        "&:hover": {
                                            backgroundColor: "#f1f1f1",
                                        },
                                    }}
                                >
                                    <CustomTypography
                                        text={monthlyPayment}
                                        variant="h4"
                                        weight="regular"
                                        color={colors.brand.color_7}
                                    />
                                </Button>
                            ))}
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
};

export default MonthlyPaymentList;
