import { HttpError, ItemForMonthlyPayment, Payments, DatabaseTypes } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createItem = async (item: ItemForMonthlyPayment.Model, trx?: DatabaseTypes.DatabaseTransaction) => {
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

const getItems = async (
  offset: number,
): Promise<{ items: ItemForMonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const items = await knex('yaazoru.item')
      .select('*')
      .orderBy('item_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.item').count('*')
    return {
      items,
      total: parseInt(count as string, 10),
    }
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

const getAllItemByMonthlyPaymentId = async (
  monthlyPayment_id: string,
  offset: number,
): Promise<{ items: ItemForMonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const items = await knex('yaazoru.item')
      .where({ monthlyPayment_id })
      .orderBy('item_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.item').where({ monthlyPayment_id }).count('*')

    return {
      items,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getAllItemsByMonthlyPaymentIdNoPagination = async (
  monthlyPayment_id: string,
): Promise<ItemForMonthlyPayment.Model[]> => {
  const knex = getDbConnection()
  return await knex('yaazoru.item').where({ monthlyPayment_id }).orderBy('item_id')
}

const updateItem = async (item_id: string, item: ItemForMonthlyPayment.Model, trx?: DatabaseTypes.DatabaseTransaction) => {
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

const deleteItem = async (item_id: string, trx?: DatabaseTypes.DatabaseTransaction) => {
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
  getAllItemsByMonthlyPaymentIdNoPagination,
  updateItem,
  deleteItem,
  doesItemExist,
}
