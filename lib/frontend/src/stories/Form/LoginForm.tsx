import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomButton } from "../../components/Button/Button";
import { CustomTextField } from "../Input/Input";
import { useForm } from "react-hook-form";
import { passwordArgs, userNameArgs } from "../Input/Input.stories";
import logo1 from '../../assets/logo1.svg';
import logo2 from '../../assets/logo2.svg';

interface LoginFormProps {
    onSubmit: (data: LoginFormInputs) => void;
}


interface LoginFormInputs {
    username: string;
    password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {

    const { control, handleSubmit } = useForm<LoginFormInputs>();

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


                <Typography
                    sx={{
                        textAlign: "right",
                        color: "#032B40",
                        fontSize: 18,
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    ?שכחתי סיסמה
                </Typography>
            </Box>

            <CustomButton
                label="התחברות למערכת"
                sx={{
                    background: "#FF7F07",
                    color: "white",
                    "&:hover": {
                        background: "#0a425f",
                    },
                }}

                onClick={handleSubmit(onSubmit)}
            />
        </Box>
    );
};

export default LoginForm;
