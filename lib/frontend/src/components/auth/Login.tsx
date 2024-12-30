import React from "react";
import loginImage from '../../assets/loginImage.svg';
import LoginForm from "../../stories/Form/Form";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

interface LoginFormInputs {
    username: string;
    password: string;
}

const Login2222: React.FC = () => {
    const navigate = useNavigate();
    const handleLogin = async (data: LoginFormInputs) => {
        console.log("Form Data:", data);
        try {
            const userPayload = {
                user_name: data.username,
                password: data.password,
            }
            const response = await login(userPayload);
            console.log('response after login:', response);
            const token = response;
            localStorage.setItem("token", token);
            navigate('/');
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                height: '100vh',
                width: '100%', 
                backgroundColor: '#0A425F', 
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                position: 'absolute',
                top: 0,
                left: 0,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                }}
            />

            <Box
                sx={{
                    width: '70%',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: '#F5F6FA',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4%', 
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '8%',
                        right: '10%',
                        color: '#032B40',
                        fontSize: '28px',
                        fontFamily: 'Heebo',
                        fontWeight: '700',
                        lineHeight: '3.5vw',
                        wordWrap: 'break-word',
                        textAlign: 'right',
                        width: '90%',
                    }}
                >
                    התחברות למערכת
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '10%',
                        width: '75%',
                        maxWidth: '500px',
                        height: 'auto',
                        zIndex: 5,
                    }}
                >
                    <LoginForm onSubmit={handleLogin} />  
                </Box>
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    top: '25%', 
                    left: '5%',
                    width: '35%', 
                    height: 'auto', 
                    zIndex: 10,
                }}
            >
                <img
                    src={loginImage}
                    alt="תמונה"
                    style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                    }}
                />
            </Box>
        </Box>
    );
};

export default Login2222;
