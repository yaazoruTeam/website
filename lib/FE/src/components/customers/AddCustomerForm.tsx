import React, { useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { CustomTextField } from "../designComponent/Input";
import { useForm } from "react-hook-form";
import { CustomButton } from "../designComponent/Button";
import { useTranslation } from "react-i18next";

interface AddCustomerFormProps {
    onSubmit: (data: AddCustomerFormInputs) => void;
    initialValues?: AddCustomerFormInputs;
    setSubmitHandler?: (submit: () => void) => void;
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

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit, initialValues, setSubmitHandler }) => {
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm<AddCustomerFormInputs>({
        defaultValues: initialValues || {
            first_name: "",
            last_name: "",
            id_number: "",
            phone_number: "",
            additional_phone: "",
            email: "",
            address: "",
            city: ""
        }
    });

    useEffect(() => {
        if (setSubmitHandler) {
            const submit = handleSubmit((data) => {
                onSubmit(data);
            });
            setSubmitHandler(submit);
        }
    }, [handleSubmit, onSubmit, setSubmitHandler]);

    const isMobile = useMediaQuery('(max-width:600px)');
    const hasInitialValues = !!initialValues;

    return (
        <Box
            style={{
                width: '100%',
                height: '100%',
                borderRadius: 12,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'inline-flex',
            }}
            sx={{
                direction: 'rtl'
            }}
        >
            <Box style={{
                alignSelf: 'stretch',
                height: '100%',
                boxShadow: '0px 4px 10px rgba(41.60, 59.76, 109.70, 0.04)',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                display: 'flex'
            }}>
                <Box style={{
                    alignSelf: 'stretch',
                    height: '100%',
                    padding: 28,
                    background: 'white',
                    borderRadius: 6,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    gap: 28,
                    display: 'flex',

                }}>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <CustomTextField
                            name="first_name"
                            label={t('firstName')}
                            rules={{
                                required: t('requiredField'),
                            }}
                            control={control}
                        />
                        <CustomTextField
                            control={control}
                            name="last_name"
                            label={t('lastName')}
                            rules={{
                                required: t('requiredField'),
                            }}
                        />
                        <CustomTextField
                            control={control}
                            name="id_number"
                            label={t('IdNumber')}
                            rules={{
                                required: t('requiredField'),
                                minLength: {
                                    value: 9,
                                    message: t('errorIdNumber'),
                                },
                                maxLength: {
                                    value: 9,
                                    message: t('errorIdNumber'),
                                },
                            }}
                        />
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <CustomTextField
                            control={control}
                            name="phone_number"
                            label={t('phone')}
                            rules={{
                                required: t('requiredField'),
                                minLength: {
                                    value: 9,
                                    message: t('warningPhone'),
                                },
                                maxLength: {
                                    value: 15,
                                    message: t('errorPhone'),
                                },
                                pattern: {
                                    value: /^\d+$/,
                                    message: t('errorPhoneDigit'),
                                },
                            }}
                        />
                        <CustomTextField
                            control={control}
                            name="additional_phone"
                            label={t('additionalPhone')}
                            rules={{
                                minLength: {
                                    value: 9,
                                    message: t('warningPhone'),
                                },
                                maxLength: {
                                    value: 15,
                                    message: t('errorPhone'),
                                },
                                pattern: {
                                    value: /^\d+$/,
                                    message: t('errorPhoneDigit'),
                                },
                            }}
                        />
                        <CustomTextField
                            control={control}
                            name="email"
                            label={t('email')}
                            type="email"
                            rules={{
                                required: t('warningEmail'),
                                pattern: {
                                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                                    message: t('errorEmail')
                                }
                            }}
                        />
                    </Box>
                    <Box style={{
                        alignSelf: 'stretch',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: 28,
                        display: 'inline-flex'
                    }}>
                        <CustomTextField
                            control={control}
                            name="address"
                            label={t('address')}
                            rules={{
                                required: t('requiredField'),
                            }}
                        />
                        <CustomTextField
                            control={control}
                            name="city"
                            label={t('city')}
                            rules={{
                                required: t('requiredField'),
                            }}
                        />
                    </Box>
                    {!hasInitialValues && (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}>
                            <CustomButton
                                label={t('saving')}
                                state="default"
                                size={isMobile ? 'small' : 'large'}
                                buttonType="first"
                                onClick={handleSubmit(onSubmit)}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default AddCustomerForm;
