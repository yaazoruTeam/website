import * as XLSX from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'
import { ProcessError } from '@service/excel/BaseExcelService'
import logger from './logger'

const readExcelFile = (filePath: string) => {
  try {
    logger.debug('Reading excel file from:', filePath)

    // בדיקה שהקובץ קיים
    if (!fs.existsSync(filePath)) {
      throw new Error(`הקובץ לא נמצא: ${filePath}`)
    }

    logger.debug('File exists, reading...')
    // קריאת קובץ ה-Excel
    const workbook = XLSX.readFile(filePath)
    logger.debug('----------------workbook-----------------')

    // console.log(workbook);

    // בחירת הגיליון הראשון
    const sheetName = workbook.SheetNames[0]
    logger.debug('----------------sheetName-----------------')

    // console.log(sheetName);

    const sheet = workbook.Sheets[sheetName]
    logger.debug('----------------sheet-----------------')

    // console.log(sheet);

    // המרת הגיליון ל-JSON
    const data = XLSX.utils.sheet_to_json(sheet)
    logger.debug('----------------data-----------------')

    // console.log(data);
    logger.info('Excel data read successfully:', { count: data.length })
    return data
  } catch (error) {
    logger.error('Error reading Excel file:', error)
    throw error
  }
}

const writeErrorsToExcel = async (
  errors: ProcessError[], 
  routeName: string = 'general'
): Promise<string | null> => {
  try {
    // אם אין שגיאות, לא צריך ליצור קובץ
    if (!errors || errors.length === 0) {
      logger.debug('✅ No errors to write')
      return null
    }

    // יצירת נתיב לתיקיית uploads
    const uploadsDir = path.resolve(__dirname, '../../uploads')

    // יצירת התיקייה אם היא לא קיימת
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      logger.debug(`📁 Created uploads directory: ${uploadsDir}`)
    }

    // מחיקת קבצי שגיאות ישנים עבור אותו route
    const existingErrorFiles = fs.readdirSync(uploadsDir)
      .filter(file => file.startsWith(`errors_${routeName}_`))
    
    existingErrorFiles.forEach(file => {
      try {
        fs.unlinkSync(path.join(uploadsDir, file))
        logger.info(`🗑️ Deleted old error file: ${file}`)
      } catch (err) {
        logger.warn(`Could not delete old error file: ${file}`)
      }
    })

    // יצירת מערך נתונים גמיש לקובץ השגיאות
    const errorRows = errors.map(error => {
      const flatData: any = {
        'מספר שורה': error.row,
        'סוג שגיאה': error.error,
      }

      // הוספת כל השדות מ-data באופן דינמי
      if (error.data && typeof error.data === 'object') {
        Object.keys(error.data).forEach(key => {
          const value = error.data[key]
          // המרה לטקסט כדי שיוצג נכון באקסל
          flatData[key] = value !== null && value !== undefined ? String(value) : ''
        })
      }
      
      return flatData
    })

    const ws = XLSX.utils.json_to_sheet(errorRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Errors')

    // יצירת שם קובץ עם שם ה-route ותאריך
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const timeStamp = new Date().toISOString().replace(/[:.]/g, '-')
    const errorFilePath = path.join(uploadsDir, `errors_${routeName}_${timestamp}_${timeStamp}.xlsx`)

    XLSX.writeFile(wb, errorFilePath)
    logger.error(`❌ ${errors.length} errors written to: ${errorFilePath}`)

    return errorFilePath
  } catch (err) {
    logger.error('Failed to write errors to Excel:', err)
    // לא זורק שגיאה כדי לא לעצור את העיבוד הראשי
    logger.warn('⚠️ Continuing without writing errors file')
    return null
  }
}

export { readExcelFile, writeErrorsToExcel }
