export const validatePhoneNumber = (value: string, t: (key: string) => string) => {
  // לוודא שרק ספרות
  if (!/^\d+$/.test(value)) {
    return t('errorPhone'); // לא ספרות → שגיאה
  }

  // בדיקה על אורך כללי (9–10 ספרות)
  if (value.length < 9 || value.length > 10) {
    return t('errorPhone');
  }

  // 🆕 בדיקה לפי קידומת
  if (/^0[23489]/.test(value)) {
    // מספר קווי (02, 03, 04, 08, 09)
    if (value.length !== 9) {
      return t('errorPhone');
    }
  } else if (/^05[02345789]/.test(value)) {
    // מספר סלולרי (050, 052, 053, 054, 055, 058, 059)
    if (value.length !== 10) {
      return t('errorPhone');
    }
  } else if (/^07[2-9]/.test(value)) {
    // מספרי VoIP (072–079)
    if (value.length !== 9) {
      return t('errorPhone');
    }
  } else {
    // 🆕 קידומת לא מוכרת
    return t('errorPhone');
  }

  return true;
};
