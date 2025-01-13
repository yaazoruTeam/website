import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { CustomTextField } from "../Input/Input";
import { Customer } from "../../model/src";

interface SelectCustomerFormInputs {
    full_name: string;
    email?: string;
    phone_number?: string;
}

interface SelectCustomerFormProps {
    customer?: Customer.Model | null;
    onNameClick?: (event: React.MouseEvent<HTMLElement>) => void; // נוסיף את האירוע
}

const SelectCustomerForm: React.FC<SelectCustomerFormProps> = ({ customer, onNameClick }) => {
    const { control, setValue } = useForm<SelectCustomerFormInputs>();
    useEffect(() => {
        if (customer) {
            setValue("full_name", customer.first_name + " " + customer.last_name);
            setValue("email", customer.email);
            setValue("phone_number", customer.phone_number);
        } else {
            // Reset the form if no customer is selected
            setValue("full_name", "הקלד שם לקוח");
            setValue("email", "");
            setValue("phone_number", "");
        }
    }, [customer, setValue]);

    return (
        <Box
            sx={{


                width: 1000,
                // paddingLeft: 2,
                // paddingRight: 2,
                // paddingTop: 1,
                // paddingBottom: 1,



                // width: "80%",
                height: "100%",
                padding: 3.5,
                backgroundColor: "white",
                borderRadius: 1,
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                gap: 3.5,
            }}
        >
            <Typography
                sx={{
                    textAlign: "center",
                    color: "#0A425F",
                    fontSize: 24,
                    fontFamily: "Heebo",
                    fontWeight: 500,
                    lineHeight: "1.2",
                    wordWrap: "break-word",
                }}
            >
                פרטי לקוח
            </Typography>
            <Box
                sx={{
                    alignSelf: "stretch",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    gap: 3.5,
                    display: "inline-flex",
                }}
            >


                {/* שדה טלפון */}
                {customer && (
                    <>
                        {/* שדה אימייל */}
                        <Box
                            sx={{
                                width: 393.33,
                                height: 90,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-end",
                                gap: 1,
                                display: "inline-flex",
                            }}
                        >
                            <CustomTextField
                                control={control}
                                name="customerEmail"
                                label="אימייל"
                                placeholder={customer.email || "אימייל"}
                                sx={{
                                    direction: "rtl",
                                    alignSelf: "stretch",
                                    padding: 2,
                                    backgroundColor: "rgba(246, 248, 252, 0.58)",
                                    borderRadius: 1,
                                }}
                                disabled
                            />
                        </Box>
                        <Box
                            sx={{
                                width: 393.33,
                                height: 90,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "flex-end",
                                gap: 1,
                                display: "inline-flex",
                            }}
                        >
                            <CustomTextField
                                control={control}
                                name="customerPhone"
                                label="טלפון"
                                placeholder={customer.phone_number || "טלפון"}
                                sx={{
                                    direction: "rtl",
                                    alignSelf: "stretch",
                                    padding: 2,
                                    backgroundColor: "rgba(246, 248, 252, 0.58)",
                                    borderRadius: 1,
                                }}
                                disabled
                            />
                        </Box>
                    </>
                )
                }
                {/* שדה שם לקוח */}
                <Box
                    sx={{
                        width: 393.33,
                        height: 90,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: 1,
                        display: "inline-flex",
                    }}
                >
                    <CustomTextField
                        control={control}
                        name="customerName"
                        label="בחר לקוח"
                        placeholder={
                            customer
                                ? `${customer.first_name} ${customer.last_name}`
                                : "הקלד שם לקוח"
                        }
                        sx={{
                            direction: "rtl",
                            alignSelf: "stretch",
                            padding: 2,
                            backgroundColor: "rgba(246, 248, 252, 0.58)",
                            borderRadius: 1,
                        }}
                        onClick={onNameClick} // נוסיף את ההאזנה לאירוע
                    />
                </Box>

            </Box>
        </Box>
    );
};

export default SelectCustomerForm;
