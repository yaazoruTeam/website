import { createTheme } from '@mui/material/styles';
import '@fontsource/heebo';

const colors = {
  neutral: {
    white: '#FFFFFF',
    color10: '#F6F8FC',
    color20: '#F1F4F9',
    color30: '#E2E8F0',
    color40: '#CBD4E1',
    color50: '#94A3B8',
    color60: '#64748B',
    color70: '#475569',
    color80: '#27364B',
    color90: '#1E2A3B',
    color100: '#0F1A2A',
  },
  brand: {
    color_1: '#172A33',
    color_2: 'rgba(21, 54, 70, 0.37)',
    color_3: '#80E4FF',
    color_4: '#FF7F07',
    color_5: '#D55188',
    color_6: '#007AFF',
    color_7: '#0059BA',
    color_8: '#0A425F',
    color_9: '#032B40',
    color_10: '#1F1F1F',
    color_11: 'rgba(246, 248, 252, 0.58)',
    color_12: 'rgba(11, 58, 82, 0.36)',
    color_13: '#E4E4E4',
    color_14: ' #F5F6FA',
    color_15: 'rgba(246, 246, 246, 0.67)',
    color_16: 'rgba(255, 255, 255, 0.50)',
    color_17: '#D0E6FF',
    color_18: ' #E5F2FF',
    color_19: 'rgba(229, 242, 255, 0.70)',
    color_20: 'rgba(224, 223, 255, 0.50)',
  },
  status: {
    success: {
      light: 'rgba(182, 255, 203, 0.70)',
      dark: '#47BA79',
    },
    warning: {
      light: 'rgba(255, 226, 185, 0.76)',
      dark: '#F68C23',
    },
    error: {
      light: 'rgba(253, 209, 220, 0.74)',
      dark: '#D83232',
    },
    yellow: 'rgba(255, 253, 202, 1)'
  },
};

// הגדרת הצבעים של ה-theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.brand.color_8, // צבע ראשי - כחול כמו הניווט הצדדי
      contrastText: colors.brand.color_9,//צבע טקסט להרבה
      light: colors.brand.color_18,//תכלת כמו של החיפוש למעלה
      dark: colors.brand.color_4,//צבע כתום של הרבה מהכפתורים
    },
    secondary: {
      // צבע משני
      main: colors.brand.color_16,//כתבתי כאן סתם צבע כדי שלא יהיו שגיאות
      dark: colors.brand.color_10,//צבע שחור 
      light: colors.brand.color_2,//צבע אפור בהיר 

    },
    error: {
      // צבע עבור שגיאות
      main: colors.status.error.dark, //כתבתי כאן סתם צבע כדי שלא יהיו שגיאות
      dark: colors.status.error.dark,
      light: colors.status.error.light,
    },
    warning: {
      // צבע עבור אזהרות
      main: colors.status.warning.dark, //כתבתי כאן סתם צבע כדי שלא יהיו שגיאות
      dark: colors.status.warning.dark,
      light: colors.status.warning.light,
    },
    info: {
      // צבע עבור מידע
      main: colors.neutral.color10, //כתבתי כאן סתם צבע כדי שלא יהיו שגיאות
    },
    success: {
      // צבע עבור הצלחה
      main: colors.status.success.dark,//כתבתי כאן סתם צבע כדי שלא יהיו שגיאות
      dark: colors.status.success.dark,
      light: colors.status.success.light,
    },

    background: {
      default: colors.brand.color_14, // צבע רקע ברירת מחדל
      paper: colors.neutral.white, // צבע רקע עבור אלמנטים כמו כרטיסים

    },
  },
  typography: {
    fontFamily: '"Heebo", sans-serif',
    h1: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: '120%',
      fontStyle: 'normal',
      fontSize: '28px',
      '@media (max-width:600px)': {
        fontSize: '24px',
      },
    },
    h2: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: '120%',
      fontStyle: 'normal',
      fontSize: '22px',
    },
    h3: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: '120%',
      fontStyle: 'normal',
      fontSize: '18px',
    },
    h4: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: '120%',
      fontStyle: 'normal',
      fontSize: '16px',
    },
    h5: {
      fontFeatureSettings: "'liga' off, 'clig' off",
      lineHeight: '120%',
      fontStyle: 'normal',
      fontSize: '14px',
    },
  },
  shadows: [
    'none',  // shadow[0] - לא צל
    '0px 2.26px 4.52px 0px rgba(9, 30, 66, 0.25)',  // shadow[1] - small
    '0px 6.78px 9.04px 0px rgba(9, 30, 66, 0.10)',  // shadow[2] - medium
    // הצללים הבאים הם ברירת המחדל של MUI, שמקבלים ערכים כמותם
    '0px 2px 5px 0px rgba(0, 0, 0, 0.15)', // shadow[3]
    '0px 3px 6px 0px rgba(0, 0, 0, 0.16)', // shadow[4]
    '0px 5px 10px 0px rgba(0, 0, 0, 0.2)', // shadow[5]
    '0px 6px 15px 0px rgba(0, 0, 0, 0.25)', // shadow[6]
    '0px 8px 20px 0px rgba(0, 0, 0, 0.3)', // shadow[7]
    '0px 9px 25px 0px rgba(0, 0, 0, 0.35)', // shadow[8]
    '0px 10px 30px 0px rgba(0, 0, 0, 0.4)', // shadow[9]
    '0px 12px 40px 0px rgba(0, 0, 0, 0.45)', // shadow[10]
    '0px 15px 50px 0px rgba(0, 0, 0, 0.5)',  // shadow[11]
    '0px 17px 55px 0px rgba(0, 0, 0, 0.55)', // shadow[12]
    '0px 20px 60px 0px rgba(0, 0, 0, 0.6)',  // shadow[13]
    '0px 25px 70px 0px rgba(0, 0, 0, 0.65)', // shadow[14]
    '0px 30px 80px 0px rgba(0, 0, 0, 0.7)',  // shadow[15]
    '0px 35px 90px 0px rgba(0, 0, 0, 0.75)', // shadow[16]
    '0px 40px 100px 0px rgba(0, 0, 0, 0.8)', // shadow[17]
    '0px 45px 110px 0px rgba(0, 0, 0, 0.85)', // shadow[18]
    '0px 50px 120px 0px rgba(0, 0, 0, 0.9)',  // shadow[19]
    '0px 55px 130px 0px rgba(0, 0, 0, 0.95)', // shadow[20]
    '0px 60px 140px 0px rgba(0, 0, 0, 1)',    // shadow[21]
    '0px 65px 150px 0px rgba(0, 0, 0, 1.05)', // shadow[22]
    '0px 70px 160px 0px rgba(0, 0, 0, 1.1)',  // shadow[23]
    '0px 75px 170px 0px rgba(0, 0, 0, 1.15)', // shadow[24]
  ],
});

export { theme, colors };
