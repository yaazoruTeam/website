import React from "react";
import { Controller, Control } from "react-hook-form";
import { TextField, Box, Typography, TextFieldProps } from "@mui/material";

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant"> {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    control: Control<any>;
    name: string;
    rules?: any
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    helperText,
    errorMessage,
    control,
    name,
    rules,
    sx,
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
                        textAlign: "right",
                        fontSize: "18px",
                        fontFamily: "Heebo",
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                >
                    {label}
                </Typography>
            )}
            <Controller
                name={name}
                rules={rules}
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        {...props}
                        error={!!fieldState.error || !!errorMessage}
                        helperText={fieldState.error?.message || errorMessage || helperText}
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
                        fullWidth
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
                    />
                )}
            />
        </Box>
    );
};
