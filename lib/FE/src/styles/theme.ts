import { createTheme } from "@mui/material/styles";
import "@fontsource/heebo";

const colors = {
  c0: "#1F1F1F", //brand color_10
  c1: "",
  c2: "#0A425F", //brand color_8
  c3: "#FF7F07", //brand color_4
  c4: "#80E4FF", //brand color_3
  c5: "",
  c6: "#FFFFFF", //neutral white
  c7: "#007AFF", //brand color_6
  c8: "#0059BA", //brand color_7
  c9: "",
  c10: "rgba(21, 54, 70, 0.37)", //'#153646 · 37%',//brand color_2
  c11: "#032B40", //brand color_9
  c12: "#E4E4E4", //brand color_13
  c13: "#D0E6FF", //brand color_17
  c14: "rgba(246, 246, 246, 0.67)", //'#F6F6F6 · 67%',//brand color_15
  c15: "#F5F6FA", //brand color_14
  c16: "#E5F2FF", //brand color_18
  c17: "#D55188", //brand.color_5
  c18: "rgba(253, 209, 220, 0.74)", //'#FDD1DC · 74%',//status error light
  c19: "rgba(255, 253, 184, 0.74)", //'#FFFDB8 · 74%',//status yellow light
  c20: "rgba(224, 223, 255, 0.5)", //'#E0DFFF · 50%',//brand color_20
  c21: "rgba(229, 242, 255, 0.7)", //'#E5F2FF · 70%',//brand color_19
  c22: "rgba(11, 58, 82, 0.36)", //'#0B3A52 · 36%',//brand color_12
  c23: "rgba(23, 42, 51, 0.52)", //'#172A33 · 52%',
  c24: "rgba(255, 255, 255, 0.5)", //'#FFFFFF · 50%',//brand color_16
  c25: "rgba(182, 255, 203, 0.7)", //'#B6FFCB · 70%',//status success light
  c26: "rgba(255, 226, 185, 0.76)", //'#FFE2B9 · 76%',//status warning light
  c27: "#F3F4F6",
  c28: "#D83232", //status error dark
  c29: "#F68C23", //status warning dark
  c30: "#47BA79", //status success dark
  feild: "rgba(246, 248, 252, 0.58)", //'#F6F8FC · 58%',//brand color_11
  c32: "rgba(253, 209, 220, 1)",
  c33: "rgba(182, 255, 203, 1)",
};

// הגדרת הצבעים של ה-theme
const theme = createTheme({
  palette: {},
  typography: {
    fontFamily: '"Heebo", sans-serif',
    h1: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: "120%",
      fontStyle: "normal",
      fontSize: "28px",
      "@media (max-width:600px)": {
        fontSize: "24px",
      },
    },
    h2: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: "120%",
      fontStyle: "normal",
      fontSize: "22px",
    },
    h3: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: "120%",
      fontStyle: "normal",
      fontSize: "18px",
    },
    h4: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: "120%",
      fontStyle: "normal",
      fontSize: "16px",
    },
    h5: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: "120%",
      fontStyle: "normal",
      fontSize: "14px",
    },
  },
  shadows: [
    "none", // shadow[0] - לא צל
    "0px 2.26px 4.52px 0px rgba(9, 30, 66, 0.25)", // shadow[1] - small
    "0px 6.78px 9.04px 0px rgba(9, 30, 66, 0.10)", // shadow[2] - medium
    // הצללים הבאים הם ברירת המחדל של MUI, שמקבלים ערכים כמותם
    "0px 2px 5px 0px rgba(0, 0, 0, 0.15)", // shadow[3]
    "0px 3px 6px 0px rgba(0, 0, 0, 0.16)", // shadow[4]
    "0px 5px 10px 0px rgba(0, 0, 0, 0.2)", // shadow[5]
    "0px 6px 15px 0px rgba(0, 0, 0, 0.25)", // shadow[6]
    "0px 8px 20px 0px rgba(0, 0, 0, 0.3)", // shadow[7]
    "0px 9px 25px 0px rgba(0, 0, 0, 0.35)", // shadow[8]
    "0px 10px 30px 0px rgba(0, 0, 0, 0.4)", // shadow[9]
    "0px 12px 40px 0px rgba(0, 0, 0, 0.45)", // shadow[10]
    "0px 15px 50px 0px rgba(0, 0, 0, 0.5)", // shadow[11]
    "0px 17px 55px 0px rgba(0, 0, 0, 0.55)", // shadow[12]
    "0px 20px 60px 0px rgba(0, 0, 0, 0.6)", // shadow[13]
    "0px 25px 70px 0px rgba(0, 0, 0, 0.65)", // shadow[14]
    "0px 30px 80px 0px rgba(0, 0, 0, 0.7)", // shadow[15]
    "0px 35px 90px 0px rgba(0, 0, 0, 0.75)", // shadow[16]
    "0px 40px 100px 0px rgba(0, 0, 0, 0.8)", // shadow[17]
    "0px 45px 110px 0px rgba(0, 0, 0, 0.85)", // shadow[18]
    "0px 50px 120px 0px rgba(0, 0, 0, 0.9)", // shadow[19]
    "0px 55px 130px 0px rgba(0, 0, 0, 0.95)", // shadow[20]
    "0px 60px 140px 0px rgba(0, 0, 0, 1)", // shadow[21]
    "0px 65px 150px 0px rgba(0, 0, 0, 1.05)", // shadow[22]
    "0px 70px 160px 0px rgba(0, 0, 0, 1.1)", // shadow[23]
    "0px 75px 170px 0px rgba(0, 0, 0, 1.15)", // shadow[24]
  ],
});

export { theme, colors };
