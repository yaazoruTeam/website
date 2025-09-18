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

// נתיב זמני לבדיקה ללא authentication
excelRouter.post(
  '/test-customerDevice', 
  uploadExcel.single('file'), 
  excelController.processCustomerDeviceExcel
)

export default excelRouter
