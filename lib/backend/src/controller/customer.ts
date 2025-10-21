import { NextFunction, Request, Response } from 'express'
import { config } from '@config/index'
import * as db from '@db/index'
import { Customer, HttpError } from '@model'
import { handleError } from './err'
import logger from '../utils/logger'

const limit = config.database.limit

const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.http('POST /customers', { body: req.body });

    Customer.sanitizeBodyExisting(req)
    const customerData = req.body
    const sanitized = Customer.sanitize(customerData, false)

    logger.debug('Checking for existing customer', { email: sanitized.email, id_number: sanitized.id_number });
    await existingCustomer(sanitized, false)

    const customer = await db.Customer.createCustomer(sanitized)

    logger.info('Customer created successfully', { customer_id: customer.customer_id });
    res.status(201).json(customer)
  } catch (error: unknown) {
    logger.error('Error in createCustomer', { error: error instanceof Error ? error.message : String(error) })
    handleError(error, next)
  }
}

const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('getCustomers called', { page, offset });

    const { customers, total } = await db.Customer.getCustomers(offset)

    logger.info('getCustomers success', { count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    logger.error('Error in getCustomers', { error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
  }
}

const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('getCustomerById called', { id: req.params.id });

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
  } catch (error: unknown) {
    logger.error('Error in getCustomerById', { id: req.params.id, error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
  }
}

const getCustomersByCity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { city } = req.params
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('getCustomersByCity called', { city, page });

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
    handleError(error, next)
  }
}

const getCustomersByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status } = req.params
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('getCustomersByStatus called', { status, page });

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
  } catch (error: unknown) {
    logger.error('Error in getCustomersByStatus', { status: req.params.status, error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
  }
}

const getCustomersByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('getCustomersByDateRange called', { startDate, endDate, page });

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
  } catch (error: unknown) {
    logger.error('Error in getCustomersByDateRange', { startDate: req.query.startDate, endDate: req.query.endDate, error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
  }
}

const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('updateCustomer called', { id: req.params.id });

    Customer.sanitizeIdExisting(req)
    Customer.sanitizeBodyExisting(req)
    const sanitized = Customer.sanitize(req.body, true)
    await existingCustomer(sanitized, true)
    const updateCustomer = await db.Customer.updateCustomer(req.params.id, sanitized)

    logger.info('Customer updated successfully', { id: req.params.id });
    res.status(200).json(updateCustomer)
  } catch (error: unknown) {
    logger.error('Error in updateCustomer', { id: req.params.id, error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
  }
}

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('deleteCustomer called', { id: req.params.id });

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
  } catch (error: unknown) {
    logger.error('Error in deleteCustomer', { id: req.params.id, error: error instanceof Error ? error.message : String(error) });
    handleError(error, next)
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
    logger.debug('getCities called');

    const cities = await db.Customer.getUniqueCities()

    logger.info('getCities success', { count: cities.length });
    res.status(200).json(cities)
  } catch (error: any) {
    logger.error('Error in getCities', { error: error.message });
    handleError(error, next)
  }
}

const searchCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchTerm = req.query.q as string
    const page = parseInt(req.params.page as string, 10) || 1
    const offset = (page - 1) * limit

    logger.debug('searchCustomers called', { searchTerm, page });

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
    handleError(error, next)
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
