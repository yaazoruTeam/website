import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { processExcelData, ExcelRowData } from '@service/ReadExcelDevicesForDonors'
import * as fs from 'fs'
import * as path from 'path'
import { handleError } from './err'

const handleReadExcelFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // בדיקה שקובץ הועלה
    console.log('Checking uploaded file...');
    
    if (!req.file) {
      res.status(400).json({
        status: 400,
        message: 'לא הועלה קובץ Excel'
      })
      return
    }

    console.log('File uploaded:', req.file.filename)
    const filePath = req.file.path
    console.log('File path: reading from:', filePath)

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    console.log('Excel file read successfully, rows:', data.length)

    // עיבוד הנתונים
    const processingResults = await processExcelData(data as ExcelRowData[])
    console.log('Data processed and saved to DB')
    console.log(`✅ Success: ${processingResults.successCount}/${processingResults.totalRows}`)
    if (processingResults.errorsCount > 0) {
      console.log(`❌ Errors: ${processingResults.errorsCount}`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    try {
      fs.unlinkSync(filePath)
      console.log('Temporary file deleted')
    } catch (deleteError) {
      console.warn('Could not delete temporary file:', deleteError)
    }

    res.status(200).json({
      message: processingResults.errorFilePath
        ? `הקובץ עובד עם ${processingResults.errorsCount} שגיאות. קובץ שגיאות נוצר.`
        : 'הקובץ עובד בהצלחה',
      totalRows: processingResults.totalRows,
      successCount: processingResults.successCount,
      errorsCount: processingResults.errorsCount,
      ...(processingResults.errorFilePath && { 
        errorFileGenerated: true
      }),
      data: data.slice(0, 3) // מחזיר רק 3 שורות ראשונות כדוגמה
    })
  } catch (error: unknown) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (deleteError) {
        console.warn('Could not delete temporary file after error:', deleteError)
      }
    }
    handleError(error, next)
  }
}

export { handleReadExcelFile }
