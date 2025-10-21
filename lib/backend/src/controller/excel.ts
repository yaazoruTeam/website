import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { processCustomerDeviceExcelData, ExcelRowData } from '@service/excel/CustomerDeviceExcelService'
import { processDeviceExcelData } from '@service/excel/DeviceExcelService'
import { processCustomerExcelData } from '@service/excel/CustomerExcelService'
import * as fs from 'fs'
import * as path from 'path'
import { handleError } from './err'
import logger from '../utils/logger'
import { config } from '../config'

/**
 * Interface לתוצאות עיבוד Excel
 */
interface ExcelProcessingResults {
  totalRows: number
  successCount: number
  errorsCount: number
  errorFilePath?: string
}

/**
 * פונקציה כללית לטיפול בהעלאת קבצי Excel
 * בודקת שקובץ הועלה ומחזירה את הנתיב שלו
 */
const handleFileUpload = (req: Request, res: Response): string | null => {
  logger.debug('Checking uploaded file...')

  if (!req.file) {
    res.status(400).json({
      status: 400,
      message: 'לא הועלה קובץ Excel'
    })
    return null
  }

  logger.debug('File uploaded:', req.file.filename)
  const filePath = req.file.path
  logger.debug('File path:', filePath)

  return filePath
}

/**
 * פונקציה כללית למחיקת קובץ זמני
 */
const cleanupTempFile = (filePath: string): void => {
  try {
    fs.unlinkSync(filePath)
    logger.info('Temporary file deleted:', filePath)
  } catch (deleteError) {
    logger.warn('Could not delete temporary file:', deleteError)
  }
}

/**
 * פונקציית helper לחילוץ שם קובץ השגיאות מהנתיב המלא
 */
const extractErrorFileName = (errorFilePath?: string): string | undefined => {
  return errorFilePath ? path.basename(errorFilePath) : undefined
}

/**
 * פונקציית helper לבניית תגובת JSON לעיבוד Excel
 */
const buildExcelProcessingResponse = (
  processingResults: ExcelProcessingResults,
  data: ExcelRowData[],
  successMessageText: string,
  errorMessageText: string
) => {
  const isSuccessful = processingResults.errorsCount === 0
  const successMessage = isSuccessful 
    ? successMessageText
    : `${errorMessageText} ${processingResults.errorsCount} שגיאות. קובץ שגיאות נוצר.`

  const errorFileName = extractErrorFileName(processingResults.errorFilePath)

  return {
    success: isSuccessful,
    message: successMessage,
    results: {
      totalRows: processingResults.totalRows,
      successCount: processingResults.successCount,
      errorsCount: processingResults.errorsCount,
      successRate: `${Math.round((processingResults.successCount / processingResults.totalRows) * 100)}%`
    },
    ...(processingResults.errorFilePath && {
      errorFile: {
        generated: true,
        message: 'קובץ שגיאות נוצר לבדיקה מפורטת',
        fileName: errorFileName
      }
    }),
    sampleData: data.slice(0, 3) // מחזיר רק 3 שורות ראשונות כדוגמה
  }
}

/**
 * קונטרולר אחראי על עיבוד קבצי Excel של לקוחות ומכשירים
 * מטפל בכל הלוגיקה הספציפית לעיבוד נתוני לקוחות ומכשירים
 */
const processCustomerDeviceExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let filePath: string | null = null

  try {
    // בדיקת העלאת קובץ
    filePath = handleFileUpload(req, res)
    if (!filePath) return // השגיאה כבר נשלחה בפונקציה

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    logger.info('Customer-Device Excel file read successfully, rows:', data.length)

    // עיבוד הנתונים הספציפיים ללקוחות ומכשירים
    const processingResults = await processCustomerDeviceExcelData(data as ExcelRowData[])
    logger.info('Customer and device data processed and saved to DB')
    logger.info(`✅ Success: ${processingResults.successCount}/${processingResults.totalRows}`)
    
    if (processingResults.errorsCount > 0) {
      logger.error(`❌ Errors: ${processingResults.errorsCount}`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    cleanupTempFile(filePath)

    // בניית תגובת JSON
    const responseData = buildExcelProcessingResponse(
      processingResults,
      data as ExcelRowData[],
      'עיבוד קובץ לקוחות-מכשירים הושלם בהצלחה! 🎉',
      'עיבוד קובץ לקוחות-מכשירים הושלם עם'
    )

    res.status(200).json(responseData)
  } catch (error: unknown) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (filePath) {
      cleanupTempFile(filePath)
    }
    handleError(error, next)
  }
}

/**
 * קונטרולר אחראי על עיבוד קבצי Excel של מכשירים בלבד
 * מטפל בכל הלוגיקה הספציפית לעיבוד נתוני מכשירים
 */
const processDeviceExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let filePath: string | null = null

  try {
    // בדיקת העלאת קובץ
    filePath = handleFileUpload(req, res)
    if (!filePath) return // השגיאה כבר נשלחה בפונקציה

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    logger.info('Device Excel file read successfully, rows:', data.length)

    // עיבוד הנתונים הספציפיים למכשירים
    const processingResults = await processDeviceExcelData(data as ExcelRowData[])
    logger.info('Device data processed and saved to DB')
    logger.info(`✅ Success: ${processingResults.successCount}/${processingResults.totalRows}`)
    
    if (processingResults.errorsCount > 0) {
      logger.error(`❌ Errors: ${processingResults.errorsCount}`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    cleanupTempFile(filePath)

    // בניית תגובת JSON
    const responseData = buildExcelProcessingResponse(
      processingResults,
      data as ExcelRowData[],
      'עיבוד קובץ מכשירים הושלם בהצלחה! 🎉',
      'עיבוד קובץ מכשירים הושלם עם'
    )

    res.status(200).json(responseData)
  } catch (error: unknown) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (filePath) {
      cleanupTempFile(filePath)
    }
    handleError(error, next)
  }
}

/**
 * קונטרולר אחראי על עיבוד קבצי Excel של לקוחות בלבד
 * מטפל בכל הלוגיקה הספציפית לעיבוד נתוני לקוחות
 */
const processCustomerExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let filePath: string | null = null

  try {
    // בדיקת העלאת קובץ
    filePath = handleFileUpload(req, res)
    if (!filePath) return // השגיאה כבר נשלחה בפונקציה

    // קריאת הקובץ
    const data = await readExcelFile(filePath)
    logger.info('Customer Excel file read successfully, rows:', data.length)

    // עיבוד הנתונים הספציפיים ללקוחות
    const processingResults = await processCustomerExcelData(data as ExcelRowData[])
    logger.info('Customer data processed and saved to DB')
    logger.info(`✅ Success: ${processingResults.successCount}/${processingResults.totalRows}`)
    
    if (processingResults.errorsCount > 0) {
      logger.error(`❌ Errors: ${processingResults.errorsCount}`)
    }

    // מחיקת הקובץ הזמני אחרי העיבוד
    cleanupTempFile(filePath)

    // בניית תגובת JSON
    const responseData = buildExcelProcessingResponse(
      processingResults,
      data as ExcelRowData[],
      'עיבוד קובץ לקוחות הושלם בהצלחה! 🎉',
      'עיבוד קובץ לקוחות הושלם עם'
    )

    res.status(200).json(responseData)
  } catch (error: unknown) {
    // מחיקת הקובץ הזמני במקרה של שגיאה
    if (filePath) {
      cleanupTempFile(filePath)
    }
    handleError(error, next)
  }
}

/**
 * הורדת קובץ שגיאות
 */
const downloadErrorFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { fileName } = req.params
    logger.info(`Request to download error file: ${fileName}`)
    // וידוא שהקובץ קיים בתיקיית uploads
    const uploadsDir = config.upload.directory
    const filePath = path.join(uploadsDir, fileName)
    logger.debug(`Constructed file path: ${filePath}`)

    // בדיקה שהקובץ קיים ושהוא קובץ שגיאות תקין
    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        status: 404,
        message: 'קובץ השגיאות לא נמצא'
      })
      return
    }
    
    // בדיקת אבטחה - וידוא שזה קובץ שגיאות
    if (!fileName.includes('errors_') || !fileName.endsWith('.xlsx')) {
      res.status(403).json({
        status: 403,
        message: 'גישה לא מורשית לקובץ זה'
      })
      return
    }
    
    logger.info('Downloading error file:', fileName)
    
    // שליחת הקובץ
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
    
    fileStream.on('end', () => {
      logger.info('Error file downloaded successfully:', fileName)
    })
    
    fileStream.on('error', (error) => {
      logger.error('Error streaming file:', error)
      if (!res.headersSent) {
        res.status(500).json({
          status: 500,
          message: 'שגיאה בהורדת הקובץ'
        })
      }
    })
    
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export { processCustomerDeviceExcel, processDeviceExcel, processCustomerExcel, downloadErrorFile }
