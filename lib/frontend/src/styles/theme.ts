import { createTheme } from '@mui/material/styles'
import '@fontsource/heebo'

const colors = {
  // ===== NEUTRALS - DARK TO LIGHT =====
  neutral900: '#121212',  // Main text color (darkest black) - c40
  neutral800: '#1F1F1F',  // Brand color_10 (very dark gray) - c0
  neutral700: '#555758',  // Dark gray - c48
  neutral600: '#666',     // Disabled text (medium dark gray) - c41
  neutral500: '#858585',  // Secondary text - c42
  neutral400: '#94A3B8',  // Medium gray - n50
  neutral350: '#989BA1',  // Neutral gray - c38
  neutral300: '#ccc',     // Disabled button background - c44
  neutral200: '#DDDDDD',  // Neutral light gray - c39
  neutral150: '#E0E0E0',  // Light gray - c36
  neutral100: '#E4E4E4',  // Brand color_13 - c12
  neutral75:  '#F5F6FA',  // Brand color_14 - c15
  neutral50:  '#F3F4F6',  // Very light gray - c27
  neutral0:   '#FFFFFF',  // Pure white - c6

  // ===== BLUES - DARK TO LIGHT =====
  blue900: '#032B40',     // Brand color_9 (darkest blue) - c11
  blue800: '#083647',     // Button hover state - c43
  blue700: '#0a3b55',     // Dark blue - c34
  blue600: '#0A425F',     // Brand color_8 - c2
  blue500: '#0059BA',     // Brand color_7 - c8
  blue400: '#007AFF',     // Brand color_6 (iOS blue) - c7
  blue300: '#1D75DD',     // Medium blue - c37
  blue200: '#80E4FF',     // Brand color_3 (light blue) - c4
  blue100: '#D0E6FF',     // Brand color_17 - c13
  blue50:  '#E5F2FF',     // Brand color_18 - c16

  // ===== PURPLES =====
  purple500: '#D55188',    // Brand color_5 (pink-purple) - c17
  purple100: '#e0dfff80',  // Light purple with transparency - c20

  // ===== REDS =====
  red500: '#D83232',       // Status error dark (dark red) - c28
  red100: '#fdd1dc',       // Light pink - c32
  red75:  '#fdd1dcbd',     // Light pink with transparency - c18

  // ===== ORANGES =====
  orange500: '#FF7F07',    // Brand color_4 (bright orange) - c3
  orange400: '#F68C23',    // Status warning dark (darker orange) - c29
  orange100: '#ffe2b9c2',  // Light orange with transparency - c26

  // ===== YELLOWS =====
  yellow100: '#fffdb8bd',  // Light yellow with transparency - c19

  // ===== GREENS =====
  green500: '#47BA79',     // Status success dark (forest green) - c30
  green100: '#b6ffcb',     // Light green - c33
  green75:  '#b6ffcbb3',   // Light green with transparency - c25

  // ===== BLUE OVERLAYS & TRANSPARENCIES =====
  blueOverlay700: '#0b3a525c', // Dark blue with 36% transparency - c22
  blueOverlay650: '#1536465e', // Dark blue with 37% transparency - c10
  blueOverlay600: '#172a3385', // Dark blue with 52% transparency - c23
  blueOverlay200: '#cdf4ff70', // Light blue with transparency - c5
  blueOverlay100: '#e5f2ffb3', // Very light blue with 70% transparency - c21
  blueOverlay50:  '#0a425f0a', // Very transparent blue - c35

  // ===== UTILITY OVERLAYS =====
  orangeSelection: '#ff7f071a', // Orange selected range background - c45
  fieldBg:         '#f6f8fc94', // Light blue-gray with transparency - feild
  grayOverlay:     '#f6f6f6ab', // Light gray with transparency - c14
  whiteOverlay:    '#ffffff80', // White with 50% transparency - c24
  hoverGray:       '#85858514', // Gray hover state - c46
  shadowLight:     '#0000001a', // Light shadow color - c47
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
