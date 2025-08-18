import { NextFunction, Request, Response } from 'express'
import { config } from '@config/index'
import * as db from '@db/index'
import { Customer, HttpError } from '@model'
import { AuditService } from '@service/auditService'

const limit = config.database.limit

const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Customer.sanitizeBodyExisting(req)
    const customerData = req.body
    const sanitized = Customer.sanitize(customerData, false)
    await existingCustomer(sanitized, false)
    const customer = await db.Customer.createCustomer(sanitized)
    
    // Create audit log for customer creation
    await AuditService.logCreate(req, AuditService.getTableName('customers'), customer.customer_id, sanitized)
    
    res.status(201).json(customer)
  } catch (error: any) {
    next(error)
  }
}

const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string)
    const offset = (page - 1) * limit

    const { customers, total } = await db.Customer.getCustomers(offset)

    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    console.log('Error in getCustomers: in controller: ', error)

    next(error)
  }
}

const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Customer.sanitizeIdExisting(req)
    const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    const customer = await db.Customer.getCustomerById(req.params.id)
    res.status(200).json(customer)
  } catch (error: any) {
    next(error)
  }
}

const getCustomersByCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { city } = req.params
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!city) {
      const error: HttpError.Model = {
        status: 400,
        message: 'City parameter is required.',
      }
      throw error
    }

    const { customers, total } = await db.Customer.getCustomersByCity(city, offset)

    if (customers.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: `No customers found in city: ${city}`,
      }
      throw error
    }

    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    next(error)
  }
}

const getCustomersByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.params
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (status !== 'active' && status !== 'inactive') {
      const error: HttpError.Model = {
        status: 400,
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      }
      throw error
    }
    const { customers, total } = await db.Customer.getCustomersByStatus(status, offset)
    // const total = await db.Customer.countCustomersByStatus(status)

    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const getCustomersByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const page = parseInt(req.query.page as string, 10) || 1
    // const limit = parseInt(req.query.limit as string, 10) || 10
    const offset = (page - 1) * limit

    if (!startDate || !endDate) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Both startDate and endDate parameters are required.',
      }
      throw error
    }

    const { customers, total } = await db.Customer.getCustomersByDateRange(
      startDate as string,
      endDate as string,
      offset,
    )
    // const total = await db.Customer.countCustomersByDateRange(startDate as string, endDate as string)

    if (customers.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: `No customers found between ${startDate} and ${endDate}`,
      }
      throw error
    }

    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    next(error)
  }
}

const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Customer.sanitizeIdExisting(req)
    Customer.sanitizeBodyExisting(req)
    
    // Get existing customer data for audit log
    const existingCustomerData = await db.Customer.getCustomerById(req.params.id)
    if (!existingCustomerData) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    
    const sanitized = Customer.sanitize(req.body, true)
    await existingCustomer(sanitized, true)
    const updatedCustomer = await db.Customer.updateCustomer(req.params.id, sanitized)
    
    // Create audit log for customer update
    await AuditService.logUpdate(
      req, 
      AuditService.getTableName('customers'), 
      req.params.id,
      existingCustomerData,
      sanitized
    )
    
    res.status(200).json(updatedCustomer)
  } catch (error: any) {
    next(error)
  }
}

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Customer.sanitizeIdExisting(req)
    const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
    if (!existCustomer) {
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    
    // Get customer data before deletion for audit log
    const customerData = await db.Customer.getCustomerById(req.params.id)
    
    const deletedCustomer = await db.Customer.deleteCustomer(req.params.id)
    
    // Create audit log for customer deletion (soft delete - status change)
    await AuditService.logDelete(
      req, 
      AuditService.getTableName('customers'), 
      req.params.id,
      customerData
    )
    
    res.status(200).json(deletedCustomer)
  } catch (error: any) {
    next(error)
  }
}

const existingCustomer = async (customer: Customer.Model, hasId: boolean) => {
  let customerEx
  if (hasId) {
    customerEx = await db.Customer.findCustomer({
      customer_id: customer.customer_id,
      email: customer.email,
      id_number: customer.id_number,
    })
  } else {
    customerEx = await db.Customer.findCustomer({
      email: customer.email,
      id_number: customer.id_number,
    })
  }
  if (customerEx) {
    Customer.sanitizeExistingCustomer(customerEx, customer)
  }
}

const getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cities = await db.Customer.getUniqueCities()
    res.status(200).json(cities)
  } catch (error) {
    next(error)
  }
}

const searchCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchTerm = req.query.q as string
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    if (!searchTerm) {
      res.status(400).json({ message: 'Missing search term' })
      return
    }

    const { customers, total } = await db.Customer.searchCustomersByName(searchTerm, offset)

    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error) {
    next(error)
  }
}

export {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomersByCity,
  getCities,
  getCustomersByStatus,
  getCustomersByDateRange,
  existingCustomer,
  searchCustomers,
}
