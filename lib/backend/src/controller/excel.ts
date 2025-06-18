import { NextFunction, Request, Response } from 'express'
import { readExcelFile } from '@/utils/excel'
import { processExcelData } from '@/service/ReadExcelDevicesForDonors'

const handleReadExcelFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await readExcelFile()
    console.log('after read excel file')
    await processExcelData(data)
    console.log('i after enter to DB')

    res.status(200).json(data)
  } catch (error: any) {
    next(error)
  }
}
export { handleReadExcelFile }
