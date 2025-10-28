import { AxiosError } from 'axios'

/**
 * פונקציה עזר לחילוץ הודעות שגיאה מ-API calls
 * מטפלת בכל סוגי השגיאות האפשריים ומחזירה הודעה ברורה
 * 
 * @param error - השגיאה שנתקבלה
 * @param fallbackMessage - הודעת ברירת מחדל במקרה שלא ניתן לחלץ הודעה מהשגיאה
 * @returns הודעת שגיאה ברורה
 */
export const extractErrorMessage = (error: unknown, fallbackMessage: string = 'Unknown error occurred'): string => {
  if (error instanceof AxiosError) {
    const serverMessage = error.response?.data?.message;
    
    if (typeof serverMessage === 'string') {
      return serverMessage;
    } else if (serverMessage && typeof serverMessage === 'object') {
      // אם השגיאה היא object, ננסה לחלץ מנו הודעה
      try {
        // אולי זה object עם property של message
        if ('message' in serverMessage && typeof serverMessage.message === 'string') {
          return serverMessage.message;
        }
        // אחרת נמיר ל-JSON אבל באופן בטוח
        return JSON.stringify(serverMessage);
      } catch {
        return fallbackMessage;
      }
    } else {
      // אם אין הודעה מהשרת, נשתמש בהודעת ה-Axios error
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return fallbackMessage;
  }
}

/**
 * פונקציה עזר ללוגים של שגיאות
 * מדפיסה פרטים מלאים על השגיאה לקונסול לצורך דיבוג
 * 
 * @param context - הקשר של השגיאה (איפה היא קרתה)
 * @param error - השגיאה
 * @param extractedMessage - ההודעה שחולצה מהשגיאה
 */
export const logErrorDetails = (context: string, error: unknown, extractedMessage?: string): void => {
  console.error(`[${context}] Error occurred:`, error);
  if (extractedMessage) {
    console.error(`[${context}] Extracted message:`, extractedMessage);
  }
  
  // Debug: Let's see what the server is actually sending
  if (error instanceof AxiosError && error.response?.data) {
    console.error(`[${context}] Server response data:`, error.response.data);
    console.error(`[${context}] Message type:`, typeof error.response.data.message);
    console.error(`[${context}] Raw message:`, error.response.data.message);
  }
}

/**
 * פונקציה משולבת לטיפול מלא בשגיאות
 * מחלצת הודעה וכותבת ללוג בו זמנית
 * 
 * @param context - הקשר של השגיאה
 * @param error - השגיאה
 * @param fallbackMessage - הודעת ברירת מחדל
 * @returns הודעת שגיאה ברורה
 */
export const handleError = (context: string, error: unknown, fallbackMessage: string = 'Unknown error occurred'): string => {
  const message = extractErrorMessage(error, fallbackMessage);
  logErrorDetails(context, error, message);
  return message;
}