import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@utils/excel'
import { processExcelData } from '@service/ReadExcelDevicesForDonors'
import logger from '../utils/logger'

const handleReadExcelFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await readExcelFile()
    logger.info('after read excel file')
    await processExcelData(data)
    logger.info('i after enter to DB')

    res.status(200).json(data)
  } catch (error: any) {
    next(error)
  }
}
export { handleReadExcelFile }
