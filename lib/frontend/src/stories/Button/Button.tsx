import React from "react";
import { ButtonProps, Button } from "@mui/material";

// Props לרכיב הכפתור עם TypeScript
export interface CustomButtonProps extends ButtonProps {
    label?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    label,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            sx={{
                borderRadius: "12px", // קצוות עגולים
                backgroundColor: "#ff7f07", // צבע ברירת המחדל (נניח צבע ראשי)
                fontFamily: "Assistant, sans-serif", // הגדרת סוג הפונט
                '&:hover': {
                    backgroundColor: '#0a425f', // שינוי צבע בהנחת עכבר
                },
                ...props.sx, // מאפשר להוסיף או לשנות עיצובים דרך ה-props של הרכיב
            }}
            {...props}
        >
            {label}
        </Button>
    );
};
