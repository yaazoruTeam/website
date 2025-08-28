import multer from 'multer'
import path from 'path'
import { NextFunction, Request, Response } from 'express'

// הגדרת תיקיית העלאות
const uploadDir = path.join(__dirname, '../../uploads')

// הגדרת אחסון עם שמות קבצים ייחודיים
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir)
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // יצירת שם קובץ ייחודי עם timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `excel-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

// מסנן לקבצי אקסל בלבד
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  const allowedExts = ['.xls', '.xlsx']
  const fileExt = path.extname(file.originalname).toLowerCase()
  
  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(fileExt)) {
    cb(null, true)
  } else {
    cb(new Error('רק קבצי Excel מותרים (.xls, .xlsx)'))
  }
}

// הגדרת multer
export const uploadExcel = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // מגבלה של 10MB
  }
})

// middleware לטיפול בשגיאות העלאה
export const handleUploadError = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 400,
        message: 'הקובץ גדול מדי. מקסימום 10MB'
      })
    }
  }
  
  if (error.message.includes('רק קבצי Excel מותרים')) {
    return res.status(400).json({
      status: 400,
      message: error.message
    })
  }
  
  next(error)
}
