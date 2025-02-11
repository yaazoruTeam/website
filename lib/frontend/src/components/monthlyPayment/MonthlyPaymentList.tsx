import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { CustomButton } from "../Button/Button";
import AddMonthlyPayment from "./AddMonthlyPayment";

interface MonthlyPaymentListProps {
    monthlyPayment: string[];
}

const MonthlyPaymentList: React.FC<MonthlyPaymentListProps> = ({ monthlyPayment }) => {
    const [showAddMonthlyPayment, setShowAddMonthlyPayment] = useState(false);

    return (
        <>
            <Box
                sx={{
                    width: "50%",
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
                        <Box
                            sx={{
                                textAlign: 'center',
                                color: '#032B40',
                                fontSize: 28,
                                fontFamily: 'Heebo',
                                fontWeight: 700,
                                lineHeight: '33.6px',
                                wordWrap: 'break-word',
                            }}
                        >
                            הוראות קבע
                        </Box>
                        <CustomButton
                            label="הוראת קבע חדש"
                            sx={{ background: "#FF7F07", color: "white", "&:hover": { background: "#0a425f" } }}
                            onClick={() => setShowAddMonthlyPayment(true)} />
                        <Box
                            sx={{
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
                                        width: 1000,
                                        height: 81,
                                        paddingLeft: 3,
                                        paddingRight: 3,
                                        backgroundColor: "white",
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
                                    <Typography
                                        sx={{
                                            color: "#0059BA",
                                            fontSize: 28,
                                            fontFamily: "Assistant, sans-serif",
                                            fontWeight: 600,
                                            lineHeight: 1.2,
                                            wordWrap: "break-word",
                                            textAlign: "center",
                                        }}
                                    >
                                        {monthlyPayment}
                                    </Typography>
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
