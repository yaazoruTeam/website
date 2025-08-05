import { Router } from 'express'
import * as itemController from '@controller/item'
import { hasRole } from '@middleware/auth'

const itemRouter = Router()

itemRouter.post('/', itemController.createItem)
itemRouter.get('/', itemController.getItems)
itemRouter.get('/:id', itemController.getItemId)
itemRouter.get('/monthlyPayment/:id', itemController.getAllItemsByMonthlyPaymentId)
itemRouter.put('/:id', itemController.updateItem)
itemRouter.delete('/:id', itemController.deleteItem)

export default itemRouter
