import { Request, Response, NextFunction } from 'express'
import {
  CreditDetails,
  HttpError,
  ItemForMonthlyPayment,
  MonthlyPayment,
  MonthlyPaymentManagement,
} from '@model'
import * as db from '@db/index'
import getDbConnection from '@db/connection'
import { updateItems } from './item'
import { handleError } from './err'
import logger from '../utils/logger'

const createMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  const knex = getDbConnection()
  const trx = await knex.transaction()
  try {
    const sanitized = MonthlyPaymentManagement.sanitize(req.body)
    const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer does not exist',
      }
      throw error
    }
    const monthlyPaymentData: MonthlyPayment.Model = await db.MonthlyPayment.createMonthlyPayment(
      sanitized.monthlyPayment,
      trx,
    )
    const existToken = await db.CreditDetails.doesTokenExist(sanitized.creditDetails.token)
    if (existToken) {
      const error: HttpError.Model = {
        status: 409,
        message: 'token already exist',
      }
      throw error
    }
    const creditDetailsData: CreditDetails.Model = await db.CreditDetails.createCreditDetails(
      sanitized.creditDetails,
      trx,
    )
    sanitized.paymentCreditLink.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id
    sanitized.paymentCreditLink.creditDetails_id = creditDetailsData.credit_id
    await db.PaymentCreditLink.createPaymentCreditLink(sanitized.paymentCreditLink, trx)
    for (const payment of sanitized.payments) {
      if (payment) {
        payment.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id
        await db.Payments.createPayments(payment, trx)
      }
    }
    for (const item of sanitized.items) {
      if (item) {
        item.monthlyPayment_id = monthlyPaymentData.monthlyPayment_id
        await db.Item.createItem(item, trx)
      }
    }
    await trx.commit()
    logger.info('create monthly payment!! success!!!')
    res.status(201).json(monthlyPaymentData)
  } catch (error: unknown) {
    handleError(error, next)
    await trx.rollback()
    logger.error('Transaction failed, all actions rolled back:', error)
    handleError(error, next)
  }
}

const updateMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  const knex = getDbConnection()
  const trx = await knex.transaction()
  try {
    MonthlyPaymentManagement.sanitizeIdExisting(req)
    MonthlyPaymentManagement.sanitizeBodyExisting(req)

    const sanitized = MonthlyPaymentManagement.sanitize(req.body)
    const { customer_id, monthlyPayment, creditDetails, items } = sanitized
    const { id } = req.params

    const existCustomer = await db.Customer.doesCustomerExist(customer_id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist',
      }
      throw error
    }

    const existingMonthlyPayment = await db.MonthlyPayment.getMonthlyPaymentById(id)
    if (!existingMonthlyPayment) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Monthly Payment does not exist',
      }
      throw error
    }
    await db.MonthlyPayment.updateMonthlyPayment(id, monthlyPayment, trx)

    const creditDetailsBeforUpdate = await db.CreditDetails.getCreditDetailsById(
      creditDetails.credit_id,
    )
    const existToken = await db.CreditDetails.doesTokenExist(creditDetails.token)
    if (existToken && creditDetails.token !== creditDetailsBeforUpdate.token) {
      const error: HttpError.Model = {
        status: 409,
        message: 'Token already exists',
      }
      throw error
    }

    await db.CreditDetails.updateCreditDetails(creditDetails.credit_id, creditDetails, trx)

    const existingItems = await db.Item.getAllItemsByMonthlyPaymentIdNoPagination(id)
    await updateItems(existingItems, items, trx)

    await trx.commit()
    logger.info('Monthly payment updated successfully!')
    res.status(200).json({ message: 'Monthly payment updated successfully!' })
  } catch (error: unknown) {
    await trx.rollback()
    logger.error('Transaction failed, all actions rolled back:', error)
    handleError(error, next)
  }
}

export { createMonthlyPayment, updateMonthlyPayment }
