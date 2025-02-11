import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { CustomTextField } from "../designComponent/Input";
import { useForm } from "react-hook-form";
import { CustomButton } from "../designComponent/Button";

interface AddCustomerFormProps {
    onSubmit: (data: AddCustomerFormInputs) => void;
}

export interface AddCustomerFormInputs {
    first_name: string;
    last_name: string;
    id_number: string;
    phone_number: string;
    additional_phone: string;
    email: string;
    address: string;
    city: string;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit }) => {

    const { control, handleSubmit } = useForm<AddCustomerFormInputs>();
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box 
            style={{
                width: '100%', 
                height: '100%', 
                borderRadius: 12,
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'flex-start', 
                gap: 28, 
                display: 'inline-flex'
            }}
        >
            <Box style={{
                alignSelf: 'stretch',
                height: 459,
                boxShadow: '0px 4px 10px rgba(41.60, 59.76, 109.70, 0.04)',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: 20,
                display: 'flex'
            }}>
                <Box style={{
                    alignSelf: 'stretch',
                    height: 459,
                    padding: 28,
                    background: 'white',
                    borderRadius: 6,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    gap: 28,
                    display: 'flex'
                }}>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="id_number"
                                label="מספר ת.ז"
                                rules={{
                                    required: "שדה חובה",
                                    minLength: {
                                        value: 9,
                                        message: "מספר ת.ז צריך להיות 9 ספרות"
                                    },
                                    maxLength: {
                                        value: 9,
                                        message: "מספר ת.ז צריך להיות 9 ספרות",
                                    },
                                }}
                            />
                        </Box>
                        <Box style={{
                            flex: '1 1 0', 
                            height: 90, 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'flex-end', 
                            gap: 8, 
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="last_name"
                                label="שם משפחה"
                                rules={{
                                    required: "שדה חובה",
                                }}
                            />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                name="first_name"
                                label="שם פרטי"
                                rules={{
                                    required: "שדה חובה",
                                }}
                                control={control}
                            />
                        </Box>
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="email"
                                label="אימייל"
                                type="email"
                                rules={{
                                    required: "אימייל הוא שדה חובה",
                                    pattern: {
                                        value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                                        message: "כתובת אימייל לא תקינה"
                                    }
                                }}
                            />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="additional_phone"
                                label="מספר נוסף"
                                rules={{
                                    minLength: {
                                        value: 9,
                                        message: 'מספר טלפון צריך להיות לפחות 9 ספרות',
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: 'מספר טלפון לא יכול להיות יותר מ-15 ספרות',
                                    },
                                    pattern: {
                                        value: /^\d+$/,
                                        message: 'מספר הטלפון חייב להכיל רק ספרות',
                                    },
                                }}
                            />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="phone_number"
                                label="טלפון"
                                rules={{
                                    required: "שדה חובה",
                                    minLength: {
                                        value: 9,
                                        message: 'מספר טלפון צריך להיות לפחות 9 ספרות',
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: 'מספר טלפון לא יכול להיות יותר מ-15 ספרות',
                                    },
                                    pattern: {
                                        value: /^\d+$/,
                                        message: 'מספר הטלפון חייב להכיל רק ספרות',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="city"
                                label="עיר"
                                rules={{
                                    required: "שדה חובה",
                                }}
                            />
                        </Box>
                        <Box style={{
                            flex: '1 1 0',
                            height: 90,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            gap: 8,
                            display: 'flex'
                        }}>
                            <CustomTextField
                                control={control}
                                name="address"
                                label="כתובת"
                                rules={{
                                    required: "שדה חובה",
                                }}
                            />
                        </Box>
                    </Box>
                    <CustomButton
                        label="שמירה"
                        state="default"
                        size={isMobile ? 'small' : 'large'}
                        buttonType="first"
                        onClick={handleSubmit(onSubmit)}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default AddCustomerForm;
