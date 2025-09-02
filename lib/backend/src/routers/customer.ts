import { Router } from 'express'
import * as customersController from '@controller/customer'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const customerRouter = Router()

customerRouter.post('/', hasRole('admin', 'branch'), AuditMiddleware.logCreate('customers'), customersController.createCustomer)
customerRouter.get('/', hasRole('admin'), customersController.getCustomers)
customerRouter.get('/cities', customersController.getCities);
customerRouter.get('/city/:city', hasRole('admin'), customersController.getCustomersByCity)
customerRouter.get('/search', hasRole('admin'), customersController.searchCustomers);
customerRouter.get('/status/:status', hasRole('admin'), customersController.getCustomersByStatus)
customerRouter.get('/dates', hasRole('admin'), customersController.getCustomersByDateRange)
customerRouter.get('/:id', hasRole('admin'), customersController.getCustomerById)
customerRouter.put('/:id', hasRole('admin', 'branch'), AuditMiddleware.logUpdate('customers'), customersController.updateCustomer)
customerRouter.delete('/:id', hasRole('admin'), AuditMiddleware.logDelete('customers'), customersController.deleteCustomer)

export default customerRouter
