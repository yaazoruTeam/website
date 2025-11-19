import { NextFunction, Request, Response } from "express"
import { handleError } from "./err"
import { getSwitchboard, postSwitchboard } from "../integration/switchboard/SwitchbordService"
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

const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerData = req.body
    logger.info('Creating new customer via Switchboard API')
    logger.debug(`Customer Data: ${JSON.stringify(customerData)}`)
    
    const newCustomer = await postSwitchboard('customer', customerData)
    logger.info('Customer created successfully via Switchboard API')
    logger.debug(`New Customer: ${JSON.stringify(newCustomer)}`)
    
    res.status(201).json(newCustomer)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

export { getCallLogHistory, createCustomer }