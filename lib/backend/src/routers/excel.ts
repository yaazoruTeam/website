import { Router } from 'express'
import { hasRole } from '@middleware/auth'
import { uploadExcel } from '@middleware/fileUpload'
import * as excelController from '@controller/excel'

const excelRouter = Router()

excelRouter.post(
  '/customerDevice', 
  hasRole('admin'), 
  uploadExcel.single('file'), 
  excelController.processCustomerDeviceExcel
)

excelRouter.post(
  '/device', 
  hasRole('admin'), 
  uploadExcel.single('file'), 
  excelController.processDeviceExcel
)

excelRouter.get(
  '/errors/:fileName',
  hasRole('admin'),
  excelController.downloadErrorFile
)

export default excelRouter
