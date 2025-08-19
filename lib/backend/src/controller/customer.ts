import { NextFunction, Request, Response } from 'express'
import { config } from '@config/index'
import * as db from '@db/index'
import { Customer, HttpError } from '@model'
import logger from '../utils/logger'

const limit = config.database.limit

const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('createCustomer called', { body: req.body });

    Customer.sanitizeBodyExisting(req)
    const customerData = req.body
    const sanitized = Customer.sanitize(customerData, false)
    
    logger.debug('Checking for existing customer', { email: sanitized.email, id_number: sanitized.id_number });
    await existingCustomer(sanitized, false)
    
    const customer = await db.Customer.createCustomer(sanitized)

    logger.info('Customer created successfully', { customer_id: customer.customer_id });
    res.status(201).json(customer)
  } catch (error: any) {
    logger.error('Error in createCustomer', { error: error.message });
    next(error)
  }
}

const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string)
    const offset = (page - 1) * limit

    logger.info('getCustomers called', { page, offset });

    const { customers, total } = await db.Customer.getCustomers(offset)

    logger.info('getCustomers success', { count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    logger.error('Error in getCustomers', { error: error.message });
    next(error)
  }
}

const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('getCustomerById called', { id: req.params.id });

    Customer.sanitizeIdExisting(req)
    const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
    if (!existCustomer) {
      logger.warn('Customer not found', { id: req.params.id });
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    const customer = await db.Customer.getCustomerById(req.params.id)
    logger.info('getCustomerById success', { id: req.params.id });
    res.status(200).json(customer)
  } catch (error: any) {
    logger.error('Error in getCustomerById', { id: req.params.id, error: error.message });
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

    logger.info('getCustomersByCity called', { city, page });

    if (!city) {
      logger.warn('Missing city parameter');
      const error: HttpError.Model = {
        status: 400,
        message: 'City parameter is required.',
      }
      throw error
    }

    const { customers, total } = await db.Customer.getCustomersByCity(city, offset)

    if (customers.length === 0) {
      logger.warn('No customers found in city', { city });
      const error: HttpError.Model = {
        status: 404,
        message: `No customers found in city: ${city}`,
      }
      throw error
    }

    logger.info('getCustomersByCity success', { city, count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    logger.error('Error in getCustomersByCity', { city: req.params.city, error: error.message });
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

    logger.info('getCustomersByStatus called', { status, page });

    if (status !== 'active' && status !== 'inactive') {
      logger.warn('Invalid status parameter', { status });
      const error: HttpError.Model = {
        status: 400,
        message: "Invalid status. Allowed values: 'active' or 'inactive'.",
      }
      throw error
    }

    const { customers, total } = await db.Customer.getCustomersByStatus(status, offset)

    logger.info('getCustomersByStatus success', { status, count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    logger.error('Error in getCustomersByStatus', { status: req.params.status, error: error.message });
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
    const offset = (page - 1) * limit

    logger.info('getCustomersByDateRange called', { startDate, endDate, page });

    if (!startDate || !endDate) {
      logger.warn('Missing date parameters', { startDate, endDate });
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

    if (customers.length === 0) {
      logger.warn('No customers found in date range', { startDate, endDate });
      const error: HttpError.Model = {
        status: 404,
        message: `No customers found between ${startDate} and ${endDate}`,
      }
      throw error
    }

    logger.info('getCustomersByDateRange success', { startDate, endDate, count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    logger.error('Error in getCustomersByDateRange', { startDate: req.query.startDate, endDate: req.query.endDate, error: error.message });
    next(error)
  }
}

const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('updateCustomer called', { id: req.params.id });

    Customer.sanitizeIdExisting(req)
    Customer.sanitizeBodyExisting(req)
    const sanitized = Customer.sanitize(req.body, true)
    await existingCustomer(sanitized, true)
    const updateCustomer = await db.Customer.updateCustomer(req.params.id, sanitized)

    logger.info('Customer updated successfully', { id: req.params.id });
    res.status(200).json(updateCustomer)
  } catch (error: any) {
    logger.error('Error in updateCustomer', { id: req.params.id, error: error.message });
    next(error)
  }
}

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('deleteCustomer called', { id: req.params.id });

    Customer.sanitizeIdExisting(req)
    const existCustomer = await db.Customer.doesCustomerExist(req.params.id)
    if (!existCustomer) {
      logger.warn('Customer not found for deletion', { id: req.params.id });
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
    const deleteCustomer = await db.Customer.deleteCustomer(req.params.id)

    logger.info('Customer deleted successfully', { id: req.params.id });
    res.status(200).json(deleteCustomer)
  } catch (error: any) {
    logger.error('Error in deleteCustomer', { id: req.params.id, error: error.message });
    next(error)
  }
}

const existingCustomer = async (customer: Customer.Model, hasId: boolean) => {
  logger.debug('Checking for existing customer', { 
    hasId, 
    email: customer.email, 
    id_number: customer.id_number,
    customer_id: hasId ? customer.customer_id : 'new'
  });

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
    logger.warn('Found conflicting customer', { 
      existing_id: customerEx.customer_id,
      conflict_field: customerEx.email === customer.email ? 'email' : 'id_number'
    });
    Customer.sanitizeExistingCustomer(customerEx, customer)
  } else {
    logger.debug('No existing customer conflicts found');
  }
}

const getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.info('getCities called');

    const cities = await db.Customer.getUniqueCities()

    logger.info('getCities success', { count: cities.length });
    res.status(200).json(cities)
  } catch (error: any) {
    logger.error('Error in getCities', { error: error.message });
    next(error)
  }
}

const searchCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchTerm = req.query.q as string
    const page = parseInt(req.query.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.info('searchCustomers called', { searchTerm, page });

    if (!searchTerm) {
      logger.warn('Missing search term');
      res.status(400).json({ message: 'Missing search term' })
      return
    }

    const { customers, total } = await db.Customer.searchCustomersByName(searchTerm, offset)

    logger.info('searchCustomers success', { searchTerm, count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: any) {
    logger.error('Error in searchCustomers', { searchTerm: req.query.q, error: error.message });
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
