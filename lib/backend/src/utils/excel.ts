import * as XLSX from 'xlsx'
import * as path from 'path'
import * as fs from 'fs'

const readExcelFile = (filePath: string) => {
  try {
    console.log('Reading excel file from:', filePath)
    
    // בדיקה שהקובץ קיים
    if (!fs.existsSync(filePath)) {
      throw new Error(`הקובץ לא נמצא: ${filePath}`)
    }
    
    console.log('File exists, reading...')
    // קריאת קובץ ה-Excel
    const workbook = XLSX.readFile(filePath)
    console.log('----------------workbook-----------------')

    // console.log(workbook);

    // בחירת הגיליון הראשון
    const sheetName = workbook.SheetNames[0]
    console.log('----------------sheetName-----------------')

    // console.log(sheetName);

    const sheet = workbook.Sheets[sheetName]
    console.log('----------------sheet-----------------')

    // console.log(sheet);

    // המרת הגיליון ל-JSON
    const data = XLSX.utils.sheet_to_json(sheet)
    console.log('----------------data-----------------')

    // console.log(data);

    return data
  } catch (error) {
    console.error('Error reading Excel file:', error)
    throw error
  }
}

const writeErrorsToExcel = async (errors: any[]): Promise<string | null> => {
  try {
    // אם אין שגיאות, לא צריך ליצור קובץ
    if (!errors || errors.length === 0) {
      console.log('✅ No errors to write')
      return null
    }

    const ws = XLSX.utils.json_to_sheet(errors)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Errors')

    // יצירת נתיב בטוח לשמירת קובץ השגיאות
    const uploadsDir = path.resolve(__dirname, '../../uploads')
    
    // יצירת התיקייה אם היא לא קיימת
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log(`📁 Created uploads directory: ${uploadsDir}`)
    }

    // יצירת שם קובץ ייחודי עם timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const errorFilePath = path.join(uploadsDir, `errors_${timestamp}.xlsx`)
    
    XLSX.writeFile(wb, errorFilePath)
    console.log(`❌ ${errors.length} errors written to: ${errorFilePath}`)
    
    return errorFilePath
  } catch (err) {
    console.error('Failed to write errors to Excel:', err)
    // לא זורק שגיאה כדי לא לעצור את העיבוד הראשי
    console.warn('⚠️ Continuing without writing errors file')
    return null
  }
}

export { readExcelFile, writeErrorsToExcel }
