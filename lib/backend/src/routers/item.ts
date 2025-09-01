import { Router } from 'express'
import * as itemController from '@controller/item'
import { hasRole } from '@middleware/auth'
import AuditMiddleware from '../middleware/auditMiddleware'

const itemRouter = Router()

itemRouter.post('/', AuditMiddleware.logCreate('items'), itemController.createItem)
itemRouter.get('/', itemController.getItems)
itemRouter.get('/:id', itemController.getItemId)
itemRouter.get('/monthlyPayment/:id', itemController.getAllItemsByMonthlyPaymentId)
itemRouter.put('/:id', AuditMiddleware.logUpdate('items'), itemController.updateItem)
itemRouter.delete('/:id', AuditMiddleware.logDelete('items'), itemController.deleteItem)

export default itemRouter
