import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { CustomButton } from "../../components/designComponent/Button";
import { CustomTextField } from "../Input/Input";
import { useForm } from "react-hook-form";
import { passwordArgs, userNameArgs } from "../Input/Input.stories";
import logo1 from '../../assets/logo1.svg';
import logo2 from '../../assets/logo2.svg';
import CustomTypography from "../../components/designComponent/Typography";
import { colors } from "../../styles/theme";

interface LoginFormProps {
    onSubmit: (data: LoginFormInputs) => void;
}


interface LoginFormInputs {
    username: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

    const { control, handleSubmit } = useForm<LoginFormInputs>();
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box
            sx={{
                width: '80%',
                padding: 6,
                backgroundColor: 'white',
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
                    {...userNameArgs}
                    control={control}
                />
                <CustomTextField
                    {...passwordArgs}
                    control={control}
                />


                <CustomTypography
                    text='?שכחתי סיסמה'
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
                label="התחברות למערכת"
                size={isMobile ? 'small' : 'large'}
                state="default"
                buttonType="first"
                onClick={handleSubmit(onSubmit)}
            />
        </Box>
    );
};

export default LoginForm;
