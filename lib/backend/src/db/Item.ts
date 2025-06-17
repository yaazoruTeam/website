import { HttpError, ItemForMonthlyPayment, Payments } from '../model'
import getDbConnection from './connection'

const createItem = async (item: ItemForMonthlyPayment.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.item') : knex('yaazoru.item')
    const [newItem] = await query
      .insert({
        monthlyPayment_id: item.monthlyPayment_id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        paymentType: item.paymentType,
        created_at: item.created_at,
        update_at: item.update_at,
      })
      .returning('*')
    return newItem
  } catch (err) {
    throw err
  }
}

const getItems = async (): Promise<ItemForMonthlyPayment.Model[]> => {
  const knex = getDbConnection()
  try {
    return await knex.select().table('yaazoru.item')
  } catch (err) {
    throw err
  }
}

const getItemId = async (item_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.item').where({ item_id }).first()
  } catch (err) {
    throw err
  }
}

const getAllItemByMonthlyPaymentId = async (monthlyPayment_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.item').where({ monthlyPayment_id })
  } catch (err) {
    throw err
  }
}

const updateItem = async (item_id: string, item: ItemForMonthlyPayment.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.item') : knex('yaazoru.item')
    const updateItem = await query.where({ item_id }).update(item).returning('*')
    if (updateItem.length === 0) {
      throw { status: 404, message: 'item not found' }
    }
    return updateItem[0]
  } catch (err) {
    throw err
  }
}

const deleteItem = async (item_id: string, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.item') : knex('yaazoru.item')
    const deleteItem = await query.where({ item_id }).del().returning('*')
    if (deleteItem.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'item not found',
      }
      throw error
    }
    return deleteItem[0]
  } catch (err) {
    throw err
  }
}

// const findCustomer = async (criteria: { customer_id?: string; email?: string; id_number?: string; }) => {
//     const knex = getDbConnection();
//     try {
//         return await knex('yaazoru.customers')
//             .where(function () {
//                 if (criteria.email) {
//                     this.orWhere({ email: criteria.email });
//                 }
//                 if (criteria.id_number) {
//                     this.orWhere({ id_number: criteria.id_number });
//                 }
//             })
//             .andWhere(function () {
//                 if (criteria.customer_id) {
//                     this.whereNot({ customer_id: criteria.customer_id });
//                 }
//             })
//             .first();
//     } catch (err) {
//         throw err;
//     }
// };

const doesItemExist = async (item_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.item').select('item_id').where({ item_id }).first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createItem,
  getItems,
  getItemId,
  getAllItemByMonthlyPaymentId,
  updateItem,
  deleteItem,
  /* findCustomer,*/ doesItemExist,
}
