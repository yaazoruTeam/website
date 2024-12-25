import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomButton } from "../Button/Button";
import { CustomTextField } from "../Input/Input";
import { loginToSystemArgs } from "../Button/Button.stories";
import { PasswordFieldArgs, UsernameFieldArgs } from "../Input/Input.stories";


const LoginForm = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        padding: 4,
        backgroundColor: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        boxShadow: 3,
      }}
    >
      {/* Header with Images */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
        }}
      >
        <img
          style={{ width: 98, height: 34 }}
          src="../../assets/logo1.png"
          alt="Logo 1"
        />
        <img
          style={{ width: 47, height: 45 }}
          src="../../assets/logo2.png"
          alt="Logo 2"
        />
      </Box>

      {/* Form Inputs */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Username Input */}
        <CustomTextField {...UsernameFieldArgs}/>

        {/* Password Input */}
        <CustomTextField {...PasswordFieldArgs} />

        {/* Forgot Password Link */}
        <Typography
          sx={{
            textAlign: "right",
            color: "#032B40",
            fontSize: 18,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          שכחתי סיסמא?
        </Typography>
      </Box>

      {/* Submit Button */}
      <CustomButton {...loginToSystemArgs}/>
    </Box>
  );
};

export default LoginForm;
