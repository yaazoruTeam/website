import { Router } from 'express'
import { hasRole } from '@middleware/auth'
import { uploadExcel } from '@middleware/fileUpload'
import * as excelController from '@controller/excel'

const excelRouter = Router()

// נתיב עם authentication
excelRouter.post(
  '/customerDevice', 
  hasRole('admin'), 
  uploadExcel.single('file'), 
  excelController.processCustomerDeviceExcel
)

// נתיב חדש למכשירים בלבד עם authentication
excelRouter.post(
  '/device', 
  hasRole('admin'), 
  uploadExcel.single('file'), 
  excelController.processDeviceExcel
)

// נתיב זמני לבדיקה ללא authentication
excelRouter.post(
  '/test-customerDevice', 
  uploadExcel.single('file'), 
  excelController.processCustomerDeviceExcel
)

// נתיב זמני לבדיקת מכשירים ללא authentication
excelRouter.post(
  '/test-device', 
  uploadExcel.single('file'), 
  excelController.processDeviceExcel
)

export default excelRouter
