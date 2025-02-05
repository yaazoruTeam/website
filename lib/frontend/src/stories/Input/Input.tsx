import React from "react";
import { Controller, Control } from "react-hook-form";
import { TextField, Box, TextFieldProps } from "@mui/material";
import CustomTypography from "../../components/designComponent/Typography";
import { colors } from "../../styles/theme";

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant"> {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    control: Control<any>;
    name: string;
    rules?: any
    placeholder?: string;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    helperText,
    errorMessage,
    control,
    name,
    rules,
    placeholder,
    sx,
    ...props
}) => {
    return (
        <Box
            sx={{
                width: "100%",
                // height: "1",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 0.5,
                display: "flex",
            }}
        >
            {label && (
                   <CustomTypography
                   text={label}
                   variant='h4'
                   weight='regular'
                   color={colors.brand.color_9}
               />
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
                        placeholder={placeholder}
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
                                height: "29px",
                                display: "flex",
                                alignItems: "center",
                            },
                            "& .MuiFormHelperText-root": {
                                fontSize: "14px",
                            },
                            ...sx,
                        }}
                        value={field.value || ''}
                    />
                )}
            />
        </Box>
    );
};
