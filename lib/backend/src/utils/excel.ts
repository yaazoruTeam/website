import * as XLSX from 'xlsx'
import * as path from 'path'
import logger from './logger'

const readExcelFile = (/*filePath: string*/) => {
  try {
    logger.info('read excel file')
    const filePath = path.resolve(__dirname, '../../lib/deviceToDonator.xlsx')
    logger.info('Absolute path to file:', filePath)
    // קריאת קובץ ה-Excel
    const workbook = XLSX.readFile(filePath)
    logger.info('----------------workbook-----------------')

    // console.log(workbook);

    // בחירת הגיליון הראשון
    const sheetName = workbook.SheetNames[0]
    logger.info('----------------sheetName-----------------')

    // console.log(sheetName);

    const sheet = workbook.Sheets[sheetName]
    logger.info('----------------sheet-----------------')

    // console.log(sheet);

    // המרת הגיליון ל-JSON
    const data = XLSX.utils.sheet_to_json(sheet)
    logger.info('----------------data-----------------')

    // console.log(data);

    return data
  } catch (error) {
    logger.error('Error reading Excel file:', error)
    throw error
  }
}

const writeErrorsToExcel = async (errors: any[]): Promise<void> => {
  try {
    const ws = XLSX.utils.json_to_sheet(errors)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Errors')

    const errorFilePath = path.resolve(__dirname, '../../lib/errors_output.xlsx')
    XLSX.writeFile(wb, errorFilePath)
    logger.error(`❌ Errors written to: ${errorFilePath}`)
  } catch (err) {
    logger.error('Failed to write errors to Excel:', err)
    throw err
  }
}

export { readExcelFile, writeErrorsToExcel }
