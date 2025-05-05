import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { CustomButton } from "../designComponent/Button";
import { CustomTextField } from "../designComponent/Input";
import { useForm } from "react-hook-form";
import logo1 from '../../assets/logo1.svg';
import logo2 from '../../assets/logo2.svg';
import CustomTypography from "../designComponent/Typography";
import { colors } from "../../styles/theme";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
    onSubmit: (data: LoginFormInputs) => void;
}


interface LoginFormInputs {
    username: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const { control, handleSubmit } = useForm<LoginFormInputs>();
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box
            sx={{
                width: '80%',
                padding: 6,
                backgroundColor: colors.neutral.white,
                borderRadius: 2,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2.5,
                display: 'inline-flex',
            }}
        >
            <Box
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8.65,
                    display: 'flex',
                }}
            >
                <img
                    style={{ width: 79.04, height: 33.53 }}
                    src={logo1}
                    alt=""
                />
                <img
                    style={{ width: 47.19, height: 45.45 }}
                    src={logo2}
                    alt=""
                />
            </Box>

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CustomTextField
                    control={control}
                    name="username"
                    label={t('userName')}
                    // helperText: "Please enter your email",
                    rules={{
                        required: t('requiredField'),
                    }}
                />
                <CustomTextField
                    control={control}
                    name="password"
                    label={t('password')}
                    type="password"
                    // helperText: "Please enter your email",
                    rules={{
                        required: t('requiredField'),
                        // minLength: {
                        //   value: 6,
                        //   message: "הסיסמה חייבת להיות לפחות 6 תווים"
                        // }
                    }}
                />
                <CustomTypography
                    text={t('forgotPassword?')}
                    variant='h3'
                    weight='medium'
                    color={colors.brand.color_9}
                    sx={{
                        textAlign: "right",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                />
            </Box>

            <CustomButton
                label={t('loginSystem')}
                size={isMobile ? 'small' : 'large'}
                state="default"
                buttonType="first"
                onClick={handleSubmit(onSubmit)}
            />
        </Box>
    );
};

export default LoginForm;
