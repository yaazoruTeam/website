import { Router } from 'express'
import * as customersController from '@controller/customer'
import { hasRole } from '@middleware/auth'

const customerRouter = Router()

customerRouter.post('/', hasRole('admin', 'branch'), customersController.createCustomer)
customerRouter.get('/page/:page', hasRole('admin'), customersController.getCustomers)
customerRouter.get('/cities', customersController.getCities);
customerRouter.get('/city/:city/page/:page', hasRole('admin'), customersController.getCustomersByCity)
customerRouter.get('/search/page/:page', hasRole('admin'), customersController.searchCustomers);
customerRouter.get('/status/:status/page/:page', hasRole('admin'), customersController.getCustomersByStatus)
customerRouter.get('/dates/page/:page', hasRole('admin'), customersController.getCustomersByDateRange)
customerRouter.get('/:id', hasRole('admin'), customersController.getCustomerById)
customerRouter.put('/:id', hasRole('admin', 'branch'), customersController.updateCustomer)
customerRouter.delete('/:id', hasRole('admin'), customersController.deleteCustomer)

export default customerRouter
