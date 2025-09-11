import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { processDevicesOnlyExcelData } from '@service/ReadDevicesOnlyExcel'
import * as fs from 'fs'
import logger from '../utils/logger'

const handleReadDevicesOnlyExcelFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // בדיקה שקובץ הועלה
    logger.debug('🔍 Checking uploaded devices-only Excel file...')

    if (!req.file) {
      res.status(400).json({
        status: 400,
        message: 'לא הועלה קובץ Excel למכשירים'
      })
      return
    }

    logger.info(`📁 Devices Excel file uploaded: ${req.file.filename}`)
    const filePath = req.file.path
    logger.debug(`📂 File path: ${filePath}`)

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    logger.info(`📊 Devices Excel file read successfully, rows: ${data.length}`)

    // בדיקה שיש נתונים
    if (!data || data.length === 0) {
      // מחיקת הקובץ הזמני
      try {
        fs.unlinkSync(filePath)
      } catch (deleteError) {
        logger.warn('Could not delete empty temporary file:', deleteError)
      }
      
      res.status(400).json({
        status: 400,
        message: 'קובץ ה-Excel ריק או לא מכיל נתונים'
      })
      return
    }

    // עיבוד הנתונים
    logger.info('🔄 Starting devices processing and Samsung validation...')
    const processingResults = await processDevicesOnlyExcelData(data)
    logger.info('✅ Devices processing completed')
    
    logger.info(`📈 Results: ${processingResults.successCount}/${processingResults.totalRows} devices processed successfully`)
    if (processingResults.errorsCount > 0) {
      logger.warn(`⚠️ ${processingResults.errorsCount} devices had errors`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    try {
      fs.unlinkSync(filePath)
      logger.debug('🗑️ Temporary file deleted')
    } catch (deleteError) {
      logger.warn('Could not delete temporary file:', deleteError)
    }

    // הכנת התגובה
    let message = ''
    if (processingResults.errorsCount === 0) {
      message = `כל ${processingResults.successCount} המכשירים עובדו בהצלחה`
    } else if (processingResults.successCount === 0) {
      message = `כל המכשירים נכשלו בעיבוד. קובץ שגיאות נוצר`
    } else {
      message = `${processingResults.successCount} מכשירים עובדו בהצלחה, ${processingResults.errorsCount} נכשלו. קובץ שגיאות נוצר`
    }

    res.status(200).json({
      message,
      totalRows: processingResults.totalRows,
      successCount: processingResults.successCount,
      errorsCount: processingResults.errorsCount,
      ...(processingResults.errorFilePath && {
        errorFileGenerated: true,
        errorFilePath: processingResults.errorFilePath
      }),
      data: data.slice(0, 3) // מחזיר רק 3 שורות ראשונות כדוגמה
    })
  } catch (error: any) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path)
        logger.debug('🗑️ Temporary file deleted after error')
      } catch (deleteError) {
        logger.warn('Could not delete temporary file after error:', deleteError)
      }
    }

    logger.error('❌ Devices Excel processing failed:', error)
    next(error)
  }
}

export { handleReadDevicesOnlyExcelFile }
