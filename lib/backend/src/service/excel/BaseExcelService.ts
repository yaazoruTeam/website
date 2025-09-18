/**
 * BaseExcelService - פונקציות בסיס לעיבוד קבצי Excel
 * מכיל פונקציות משותפות שיכולות להיות בשימוש על ידי כל שירותי Excel
 */

export interface ExcelRowData {
  [key: string]: unknown
}

export interface ProcessError {
  row: number
  error: string
  data: ExcelRowData
}

export interface ProcessingResult {
  totalRows: number
  errorsCount: number
  successCount: number
  errorFilePath?: string
}

/**
 * פונקציה בסיסית לוולידציה של שורת נתונים
 */
export const validateRowData = (rowData: ExcelRowData, requiredFields: string[]): boolean => {
  return requiredFields.every(field => 
    rowData[field] && 
    typeof rowData[field] === 'string' && 
    (rowData[field] as string).trim() !== ''
  )
}

/**
 * פונקציה בסיסית לחישוב אחוז הצלחה
 */
export const calculateSuccessRate = (successCount: number, totalRows: number): string => {
  if (totalRows === 0) return '0%'
  return `${Math.round((successCount / totalRows) * 100)}%`
}

/**
 * פונקציה בסיסית לבניית תוצאות עיבוד
 */
export const buildProcessingResult = (
  totalRows: number,
  successCount: number,
  errors: ProcessError[],
  errorFilePath?: string
): ProcessingResult => {
  return {
    totalRows,
    errorsCount: errors.length,
    successCount,
    ...(errorFilePath && { errorFilePath })
  }
}

/**
 * פונקציה לכתיבת שגיאות לקובץ Excel - מוגדרת כאן לשימוש עתידי
 * @param errors - מערך שגיאות
 * @param routeName - שם המסלול לשם הקובץ
 */
export const createErrorFileName = (routeName: string): string => {
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `errors_${routeName}_${timestamp}_${timeStamp}.xlsx`
}