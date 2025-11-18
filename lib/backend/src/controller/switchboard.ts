import { NextFunction, Request, Response } from "express"
import { handleError } from "./err"
import { getSwitchboard } from "../integration/switchboard/SwitchbordService"
import logger from "../utils/logger"

const getCallLogHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const callHistory = await getSwitchboard('call-log')
    logger.info('Fetched call log history from Switchboard API')
    logger.debug(`Call Log History: ${JSON.stringify(callHistory)}`)
    res.status(200).json(callHistory)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export { getCallLogHistory }