import { createTheme } from '@mui/material/styles'
import '@fontsource/heebo'

const colors = {
  // ===== NEUTRALS - DARK TO LIGHT =====
  neutral900: '#121212',
  neutral800: '#1F1F1F',
  neutral700: '#555758',
  neutral600: '#666',
  neutral500: '#858585',
  neutral400: '#94A3B8',
  neutral350: '#989BA1',
  neutral300: '#ccc',
  neutral200: '#DDDDDD',
  neutral150: '#E0E0E0',
  neutral100: '#E4E4E4',
  neutral75:  '#F5F6FA',
  neutral50:  '#F3F4F6',
  neutral0:   '#FFFFFF',

  // ===== BLUES - DARK TO LIGHT =====
  blue900: '#032B40',
  blue800: '#083647',
  blue700: '#0a3b55',
  blue600: '#0A425F',
  blue500: '#0059BA',
  blue400: '#007AFF',
  blue300: '#1D75DD',
  blue200: '#80E4FF',
  blue100: '#D0E6FF',
  blue50:  '#E5F2FF',

  // ===== PURPLES =====
  purple500: '#D55188',
  purple100: '#e0dfff80',

  // ===== REDS =====
  red500: '#D83232',
  red100: '#fdd1dc',
  red75:  '#fdd1dcbd',

  // ===== ORANGES =====
  orange500: '#FF7F07',
  orange400: '#F68C23',
  orange100: '#ffe2b9c2',

  // ===== YELLOWS =====
  yellow100: '#fffdb8bd',

  // ===== GREENS =====
  green500: '#47BA79',
  green100: '#b6ffcb',
  green75:  '#b6ffcbb3',

  // ===== BLUE OVERLAYS & TRANSPARENCIES =====
  blueOverlay700: '#0b3a525c',
  blueOverlay650: '#1536465e',
  blueOverlay600: '#172a3385',
  blueOverlay200: '#cdf4ff70',
  blueOverlay100: '#e5f2ffb3',
  blueOverlay50:  '#0a425f0a',

  // ===== UTILITY OVERLAYS =====
  orangeSelection: '#ff7f071a',
  fieldBg:         '#f6f8fc94',
  grayOverlay:     '#f6f6f6ab',
  whiteOverlay:    '#ffffff80',
  hoverGray:       '#85858514',
  shadowLight:     '#0000001a',
}

// הגדרת הצבעים של ה-theme
const theme = createTheme({
  palette: {},
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
    'none', // shadow[0] - לא צל
    '0px 2.26px 4.52px 0px rgba(9, 30, 66, 0.25)', // shadow[1] - small
    '0px 6.78px 9.04px 0px rgba(9, 30, 66, 0.10)', // shadow[2] - medium
    // הצללים הבאים הם ברירת המחדל של MUI, שמקבלים ערכים כמותם
    '0px 2px 5px 0px rgba(0, 0, 0, 0.15)', // shadow[3]
    '0px 3px 6px 0px rgba(0, 0, 0, 0.16)', // shadow[4]
    '0px 5px 10px 0px rgba(0, 0, 0, 0.2)', // shadow[5]
    '0px 6px 15px 0px rgba(0, 0, 0, 0.25)', // shadow[6]
    '0px 8px 20px 0px rgba(0, 0, 0, 0.3)', // shadow[7]
    '0px 9px 25px 0px rgba(0, 0, 0, 0.35)', // shadow[8]
    '0px 10px 30px 0px rgba(0, 0, 0, 0.4)', // shadow[9]
    '0px 12px 40px 0px rgba(0, 0, 0, 0.45)', // shadow[10]
    '0px 15px 50px 0px rgba(0, 0, 0, 0.5)', // shadow[11]
    '0px 17px 55px 0px rgba(0, 0, 0, 0.55)', // shadow[12]
    '0px 20px 60px 0px rgba(0, 0, 0, 0.6)', // shadow[13]
    '0px 25px 70px 0px rgba(0, 0, 0, 0.65)', // shadow[14]
    '0px 30px 80px 0px rgba(0, 0, 0, 0.7)', // shadow[15]
    '0px 35px 90px 0px rgba(0, 0, 0, 0.75)', // shadow[16]
    '0px 40px 100px 0px rgba(0, 0, 0, 0.8)', // shadow[17]
    '0px 45px 110px 0px rgba(0, 0, 0, 0.85)', // shadow[18]
    '0px 50px 120px 0px rgba(0, 0, 0, 0.9)', // shadow[19]
    '0px 55px 130px 0px rgba(0, 0, 0, 0.95)', // shadow[20]
    '0px 60px 140px 0px rgba(0, 0, 0, 1)', // shadow[21]
    '0px 65px 150px 0px rgba(0, 0, 0, 1.05)', // shadow[22]
    '0px 70px 160px 0px rgba(0, 0, 0, 1.1)', // shadow[23]
    '0px 75px 170px 0px rgba(0, 0, 0, 1.15)', // shadow[24]
  ],
})

export { theme, colors }
