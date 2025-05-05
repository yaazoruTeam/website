import React from "react";
import { Controller, Control } from "react-hook-form";
import { TextField, Box, TextFieldProps, InputAdornment } from "@mui/material";
import CustomTypography from "./Typography";
import { colors } from "../../styles/theme";

export interface CustomTextFieldProps extends Omit<TextFieldProps, "variant"> {
    label?: string;
    helperText?: string;
    errorMessage?: string;
    control: Control<any>;
    name: string;
    rules?: any;
    placeholder?: string;
    icon?: React.ReactNode;
    height?: '44px' | '96px';
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    helperText,
    errorMessage,
    control,
    name,
    rules,
    placeholder,
    icon,
    height = '44px',
    sx,
    ...props
}) => {
    const isLargeHeight = height === '96px';
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                display: "inline-flex",
                direction: "rtl",
            }}
        >
            {label && (
                <CustomTypography
                    text={label}
                    variant="h4"
                    weight="regular"
                    color={colors.brand.color_9}
                    sx={{
                        textAlign: "right",
                        direction: "rtl",
                    }}
                />
            )}
            <Controller
                name={name}
                rules={rules}
                control={control}
                render={({ field, fieldState }) => (
                    <Box
                        sx={{
                            width: '100%',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-end",
                        }}
                    >
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
                                        color: colors.brand.color_9,
                                        fontSize: '16px',
                                        fontFeatureSettings: "'liga' off, 'clig' off",
                                        lineHeight: '120%',
                                        fontStyle: 'normal',
                                        fontWeight: 400,
                                        wordWrap: "break-word",
                                    },
                                    endAdornment: icon ? (
                                        <InputAdornment position="end">
                                            {React.cloneElement(icon as React.ReactElement, { style: { width: '24px', height: '24px', color: colors.brand.color_9, position: 'relative' } })}
                                        </InputAdornment>
                                    ) : null,
                                },
                            }}
                            fullWidth
                            multiline={isLargeHeight}
                            sx={{
                                borderRadius: "6px",
                                background: colors.brand.color_11,
                                alignSelf: "stretch",
                                height: height,
                                "& .MuiInputBase-root": {
                                    height: "29px",
                                    display: "flex",
                                    alignItems: "center",
                                },
                                ...sx,
                                "@media (max-width: 600px)": {
                                    width: "100%",
                                    padding: "8px",
                                    gap: "8px",
                                },
                                "@media (min-width: 600px)": {
                                    width: "100%",
                                    padding: "10px",
                                    height: height,
                                },
                            }}
                            value={field.value || ""}
                        />
                    </Box>
                )}
            />
        </Box>
    );
};
