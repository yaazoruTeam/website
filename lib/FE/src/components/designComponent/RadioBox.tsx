// import React from "react";
// import { colors } from "../../styles/theme";
// import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";


// export const CustomRadioBox: React.FC<RadioBox> = ({ }) => {
//     return (
//         <FormControl>
//             <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
//             <RadioGroup
//                 aria-labelledby="demo-radio-buttons-group-label"
//                 defaultValue="female"
//                 name="radio-buttons-group"
//             >
//                 <FormControlLabel
//                     value="female"
//                     control={<Radio />}
//                     label="Female"
//                      />
//                 <FormControlLabel
//                     value="male"
//                     control={<Radio />}
//                     label="Male"
//                      />
//                 <FormControlLabel
//                  value="other" 
//                  control={<Radio />} 
//                  label="Other" />
//             </RadioGroup>
//         </FormControl>
//     );
// };




// import React, { useState } from "react";
// import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
// // import MaleIcon from "@mui/icons-material/Male";
// import ChooseIcon from "../../assets/circleForRadioBox.svg";
// import DefaultIcon from "../../assets/circleForRadioBoxDefaulte.svg";

// export interface RadioBox {
//     value1: string;
//     label1: string;
//     value2: string;
//     label2: string;
// }

// const CustomRadioBox: React.FC<RadioBox> = ({ value1, label1, value2, label2 }) => {
//     const [selectedValue, setSelectedValue] = useState<string>(value1);

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSelectedValue(event.target.value);
//     };

//     return (
//         <FormControl>
//             <RadioGroup value={selectedValue} onChange={handleChange} row>
//                 <FormControlLabel
//                     value={value1}
//                     control={
//                         <Radio
//                             icon={<img src={DefaultIcon} alt="" style={{ width: '20px', height: '20px' }} />} // אייקון ברירת מחדל
//                             checkedIcon={<img src={ChooseIcon} alt="" style={{ width: '20px', height: '20px' }} />} // אייקון כאשר נבחר
//                         />
//                     }
//                     label={label1}
//                 />
//                 <FormControlLabel
//                     value={value2}
//                     control={
//                         <Radio
//                             icon={<img src={DefaultIcon} alt="" style={{ width: '20px', height: '20px' }} />} // אייקון ברירת מחדל
//                             checkedIcon={<img src={ChooseIcon} alt="" style={{ width: '20px', height: '20px' }} />} // אייקון כאשר נבחר
//                         />
//                     }
//                     label={label2}
//                 />
//             </RadioGroup>
//         </FormControl>
//     );
// };

// export default CustomRadioBox;

import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import ChooseIcon from "../../assets/circleForRadioBox.svg";
import DefaultIcon from "../../assets/circleForRadioBoxDefaulte.svg";
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
                                            border: status !== "selected" ? `0.67px solid ${colors.brand.color_2}` : "none", // ✅ שינוי - קו מסגרת במצב default/hover
                                            background: status === "selected" ? colors.brand.color_8 : "transparent", // ✅ שינוי - מילוי במצב נבחר
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
                                            background: colors.brand.color_8, // ✅ שינוי - מילוי מלא במצב נבחר
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
