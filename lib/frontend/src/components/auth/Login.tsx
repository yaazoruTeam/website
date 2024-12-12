import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userPayload = {
                user_name: username,
                password: password,
            }
            const response = await login(userPayload);
            console.log('response after login:', response);

            const token = response;
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
