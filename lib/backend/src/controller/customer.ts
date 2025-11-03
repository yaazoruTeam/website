import { NextFunction, Request, Response } from 'express'
import { config } from '@config/index'
import { customerRepository } from '@repositories/CustomerRepository'
import { Customer, HttpError } from '@model'
import { CustomerStatus } from '../entities/Customer'
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

    const customer = await customerRepository.createCustomer({
      first_name: sanitized.first_name,
      last_name: sanitized.last_name,
      id_number: sanitized.id_number,
      phone_number: sanitized.phone_number,
      additional_phone: sanitized.additional_phone || null,
      email: sanitized.email,
      city: sanitized.city,
      address: sanitized.address,
      status: (sanitized.status as CustomerStatus) || CustomerStatus.ACTIVE,
    })

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

    const { customers, total } = await customerRepository.getCustomers(offset)

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
    const customer = await customerRepository.getCustomerById(parseInt(req.params.id))
    if (!customer) {
      logger.warn('Customer not found', { id: req.params.id });
      const error: HttpError.Model = {
        status: 404,
        message: 'Customer does not exist.',
      }
      throw error
    }
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

    const { customers, total } = await customerRepository.find({ city: city }, offset)

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
  } catch (error: unknown) {
    logger.error('Error in getCustomersByCity', { city: req.params.city, error: error instanceof Error ? error.message : String(error) });
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

    // Validate status is one of the allowed enum values
    const validStatuses = Object.values(CustomerStatus)
    if (!validStatuses.includes(status as CustomerStatus)) {
      logger.warn('Invalid status parameter', { status, validStatuses });
      const error: HttpError.Model = {
        status: 400,
        message: `Invalid status. Allowed values: '${validStatuses.join("' or '")}'.`,
      }
      throw error
    }

    const { customers, total } = await customerRepository.find(
      { status: status as CustomerStatus },
      offset,
    )

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

    const { customers, total } = await customerRepository.findByDate(
      new Date(startDate as string),
      new Date(endDate as string),
      offset,
    )

    if (customers.length === 0) {
      logger.warn('No customers found in date range', { startDate, endDate });
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

    const numericId = parseInt(req.params.id)
    const updateData = {
      first_name: sanitized.first_name,
      last_name: sanitized.last_name,
      phone_number: sanitized.phone_number,
      additional_phone: sanitized.additional_phone || null,
      email: sanitized.email,
      city: sanitized.city,
      address: sanitized.address,
      status: (sanitized.status as CustomerStatus) || CustomerStatus.ACTIVE,
    }
    const updateCustomer = await customerRepository.updateCustomer(numericId, updateData)

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
    const numericId = parseInt(req.params.id)
    
    // ✅ Repository handles the 404 check internally
    const deletedCustomer = await customerRepository.deleteCustomer(numericId)

    logger.info('Customer deleted successfully', { id: req.params.id });
    res.status(200).json(deletedCustomer)
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
    phone_number: customer.phone_number,
    customer_id: hasId ? customer.customer_id : 0
  });

  let customerEx
  if (hasId) {
    // ✅ UPDATE: משדרים את customer_id כדי לא להזריק שגיאה על אותו ה-row
    // ✅ בודקים את כל ה-UNIQUE fields: email, id_number, phone_number
    customerEx = await customerRepository.findExistingCustomer({
      customer_id: customer.customer_id,
      email: customer.email,
      id_number: customer.id_number,
      phone_number: customer.phone_number,
    })
  } else {
    // ✅ CREATE: לא משדרים customer_id (עדיין אין)
    // ✅ בודקים את כל ה-UNIQUE fields: email, id_number, phone_number
    customerEx = await customerRepository.findExistingCustomer({
      email: customer.email,
      id_number: customer.id_number,
      phone_number: customer.phone_number,
    })
  }

  if (customerEx) {
    logger.warn('Found conflicting customer', {
      existing_id: customerEx.customer_id,
      conflict_field: customerEx.email === customer.email ? 'email' : 'id_number'
    });
    // Convert TypeORM entity to Customer.Model interface
    const customerExModel: Customer.Model = {
      ...customerEx,
      customer_id: (customerEx.customer_id),
      additional_phone: customerEx.additional_phone || '',
    }
    Customer.sanitizeExistingCustomer(customerExModel, customer)
  } else {
    logger.debug('No existing customer conflicts found');
  }
}

const getCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    logger.debug('getCities called');

    const cities = await customerRepository.getUniqueCities()

    logger.info('getCities success', { count: cities.length });
    res.status(200).json(cities)
  } catch (error: unknown) {
    logger.error('Error in getCities', { error: error instanceof Error ? error.message : String(error) });
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

    const { customers, total } = await customerRepository.searchCustomersByName(searchTerm, offset)

    logger.info('searchCustomers success', { searchTerm, count: customers.length, total });
    res.status(200).json({
      data: customers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  } catch (error: unknown) {
    logger.error('Error in searchCustomers', { searchTerm: req.query.q, error: error instanceof Error ? error.message : String(error) });
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
