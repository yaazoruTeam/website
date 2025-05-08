import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import { colors } from "../../styles/theme";

export interface RadioBoxProps {
    options: { value: string; label: string }[];  // ✅ שינוי - שימוש במערך אופציות גמיש יותר
    status: "default" | "hover" | "selected";    // ✅ שינוי - הוספת תמיכה במצבי הכפתור
}

const CustomRadioBox: React.FC<RadioBoxProps> = ({ options, status }) => {
    const [selectedValue, setSelectedValue] = useState<string>(options[0]?.value || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    return (
        <FormControl>
            <RadioGroup value={selectedValue} onChange={handleChange} row>
                {options.map(({ value, label }) => (
                    <FormControlLabel
                        key={value}
                        value={value}
                        control={
                            <Radio
                                icon={
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            position: "relative",
                                            borderRadius: "50%",
                                            border: status !== "selected" ? `0.67px solid ${colors.c10}` : "none", // ✅ שינוי - קו מסגרת במצב default/hover
                                            background: status === "selected" ? colors.c2 : "transparent", // ✅ שינוי - מילוי במצב נבחר
                                        }}
                                    ></div>
                                }
                                checkedIcon={
                                    <div
                                        style={{
                                            width: 16,
                                            height: 16,
                                            position: "relative",
                                            borderRadius: "50%",
                                            background: colors.c2, 
                                        }}
                                    ></div>
                                }
                            />
                        }
                        label={label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px",
                            borderRadius: "16px",
                            justifyContent: "flex-end",
                            cursor: "pointer",
                            background: selectedValue === value ? "#E5F4FF" : "transparent", // ✅ שינוי - רקע כאשר הכפתור נבחר
                        }}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export default CustomRadioBox;
