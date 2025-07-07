import { Request, Response, NextFunction } from 'express'
import { HttpError, MonthlyPayment } from '@model'
import * as db from '@/db'
import dotenv from 'dotenv'
dotenv.config()

const limit = Number(process.env.LIMIT) || 10

const createMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    MonthlyPayment.sanitizeBodyExisting(req)
    const monthlyPaymentData = req.body
    const sanitized = MonthlyPayment.sanitize(monthlyPaymentData, false)
    const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer dose not exist',
      }
      throw error
    }
    const monthlyPayment = await db.MonthlyPayment.createMonthlyPayment(sanitized)
    res.status(201).json(monthlyPayment)
  } catch (error: any) {
    next(error)
  }
}

const getMonthlyPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1
        const offset = (page - 1) * limit

        const { monthlyPayments, total } = await db.MonthlyPayment.getMonthlyPayments(offset)

        res.status(200).json({
            data: monthlyPayments,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        })
    } catch (error: any) {
        next(error)
    }
}

const getMonthlyPaymentId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    MonthlyPayment.sanitizeIdExisting(req)
    const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(req.params.id)
    if (!existMonthlyPayment) {
      const error: HttpError.Model = {
        status: 404,
        message: 'monthlyPayment does not exist.',
      }
      throw error
    }
    const monthlyPayment = await db.MonthlyPayment.getMonthlyPaymentById(req.params.id)
    res.status(200).json(monthlyPayment)
  } catch (error: any) {
    next(error)
  }
}

const getMonthlyPaymentByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        MonthlyPayment.sanitizeIdExisting(req)
        const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'customer does not exist.',
            }
            throw error
        }
        const page = parseInt(req.query.page as string, 10) || 1
        const offset = (page - 1) * limit

        const { monthlyPayments, total } = await db.MonthlyPayment.getMonthlyPaymentsByCustomerId(req.params.id, offset)

        if (monthlyPayments.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'There is no monthly payment for this customer.',
            }
            throw error
        }
        res.status(200).json({
            data: monthlyPayments,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        })
  } catch (error: any) {
    next(error)
  }
}
const getMonthlyPaymentsByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.params
        if (status !== 'active' && status !== 'inactive') {
            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid status. Allowed values: \'active\', \'inactive\'.',
            }
            throw error
        }
        const page = parseInt(req.query.page as string, 10) || 1
        const offset = (page - 1) * limit

        const { monthlyPayments, total } = await db.MonthlyPayment.getMonthlyPaymentsByStatus(status, offset)

        res.status(200).json({
            data: monthlyPayments,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        })
    } catch (error: any) {
        next(error)
    }
}

const getMonthlyPaymentByOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organization } = req.params
        if (!organization) {
            const error: HttpError.Model = {
                status: 400,
                message: 'Invalid organization.',
            }
            throw error
        }
        const page = parseInt(req.query.page as string, 10) || 1
        const offset = (page - 1) * limit

        const { monthlyPayments, total } = await db.MonthlyPayment.getMonthlyPaymentsByOrganization(organization, offset)

        if (monthlyPayments.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: `organization ${organization} not found`,
            }
            throw error
        }
        res.status(200).json({
            data: monthlyPayments,
            page,
            totalPages: Math.ceil(total / limit),
            total,
        })
    } catch (error: any) {
        next(error)
    }
}

const updateMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    MonthlyPayment.sanitizeIdExisting(req)
    MonthlyPayment.sanitizeBodyExisting(req)
    const sanitized = MonthlyPayment.sanitize(req.body, true)
    const existCustomer = await db.Customer.doesCustomerExist(sanitized.customer_id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'customer dose not exist',
      }
      throw error
    }
    const updateMonthlyPayment = await db.MonthlyPayment.updateMonthlyPayment(
      req.params.id,
      sanitized,
    )
    res.status(200).json(updateMonthlyPayment)
  } catch (error: any) {
    next(error)
  }
}

//לשים ❤️ שכאשר אני מוחקת כרטיס אשראי אני צריכה למחוק גם מהטבלת קשרים ולבדוק מה עם ההוראת קבע
const deleteMonthlyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    MonthlyPayment.sanitizeIdExisting(req)
    const existMonthlyPayment = await db.MonthlyPayment.doesMonthlyPaymentExist(req.params.id)
    if (!existMonthlyPayment) {
      const error: HttpError.Model = {
        status: 404,
        message: 'MonthlyPayment does not exist.',
      }
      throw error
    }
    const deleteMonthlyPayment = await db.MonthlyPayment.deleteMonthlyPayment(req.params.id)
    res.status(200).json(deleteMonthlyPayment)
  } catch (error: any) {
    next(error)
  }
}
export {
  createMonthlyPayment,
  getMonthlyPayments,
  getMonthlyPaymentId,
  getMonthlyPaymentByCustomerId,
  updateMonthlyPayment,
  deleteMonthlyPayment,
  getMonthlyPaymentsByStatus,
  getMonthlyPaymentByOrganization,
}
