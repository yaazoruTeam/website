import React from "react";
import { ButtonProps, Button } from "@mui/material";
import '@fontsource/heebo';

export interface CustomButtonProps extends ButtonProps {
    label?: string;
    img?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    sx,
    img,
    ...props
}) => {
    return (
        <Button
            sx={{
                padding: "12px 20px",
                borderRadius: "12px",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                display: "flex",
                fontFamily: "Heebo, Arial, sans-serif",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "17px",
                lineHeight: "normal",
                fontStyle: "normal",
                fontFeatureSettings: "'liga' off, 'clig' off",
                ...sx,
            }}
            {...props}
        >
            {label}
            {img ? <img src={img} alt="" /> : ''}
        </Button>
    );
};
