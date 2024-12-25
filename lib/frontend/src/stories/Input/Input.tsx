import React from "react";
import { TextFieldProps, TextField, Box, Typography } from "@mui/material";
import "@fontsource/heebo";

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant"> {
    label?: string;
    helperText?: string;
    img?: string;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    helperText,
    sx,
    img,
    ...props
}) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "90px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 0.5,
                display: "flex",
            }}
        >
            {label && (
                <Typography
                    sx={{
                        color: "var(--Color-11, #032B40)",
                        fontFeatureSettings: "'liga' off, 'clig' off",
                        textAlign: "right",
                        fontSize: "18px",
                        fontFamily: "Heebo",
                        fontWeight: 400,
                        wordWrap: "break-word",
                        lineHeight: "normal",
                    }}
                >
                    {label}
                </Typography>
            )}

            <TextField
                helperText={helperText}
                variant="standard"
                slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: {
                        color: "#032B40",
                        fontSize: 20,
                        fontFamily: "Heebo",
                        fontWeight: 400,
                        wordWrap: "break-word",
                    },
                    },
                  }}
                sx={{
                    borderRadius: "6px",
                    background: "var(--feild, rgba(246, 248, 252, 0.58))",
                    alignSelf: "stretch",
                    padding: "10px",
                    "& .MuiInputBase-root": {
                        height: "49px",
                        display: "flex",
                        alignItems: "center",
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "14px",
                    },
                    ...sx,
                }}
                {...props}
            />
        </Box>
    );
};
