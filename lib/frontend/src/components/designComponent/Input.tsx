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
    height?: 44 | 96;
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
    height = 44,
    sx,
    ...props
}) => {
    const isLargeHeight = height === 96;
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
                        marginBottom: "8px",
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
                        // אפשר להתאים את הרוחב לפי המסך
                        width: '100%', // רוחב דינמי של 100% בהתאמה
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: 1,
                        padding: '0 10px', // padding מותאם
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
                                        fontSize: 20,
                                        fontFamily: "Heebo",
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
                                padding: "10px",
                                height: height,
                                paddingTop: "10px",
                                "& .MuiInputBase-root": {
                                    height: "29px",
                                    display: "flex",
                                    alignItems: "center",
                                },
                                "& .MuiFormHelperText-root": {
                                    fontSize: "14px",
                                },
                                ...sx,
                               // התאמת רוחב וגובה דינמיים למובייל
                               "@media (max-width: 600px)": { // למובייל
                                width: "100%", // רוחב המלא של המסך
                                fontSize: "16px", // גודל טקסט למובייל
                                padding: "8px", // padding מותאם למובייל
                                gap: "8px", // מרווח בין האלמנטים במובייל
                            },
                            "@media (min-width: 600px)": { // לדסקטופ
                                width: "100%", // רוחב המלא של המסך בגדול
                                fontSize: "16px", // גודל טקסט לדסקטופ
                                padding: "10px", // padding מותאם לדסקטופ
                                height: height, // שדה בגובה מותאם
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
