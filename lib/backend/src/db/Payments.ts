import { HttpError, Payments } from '../model'
import getDbConnection from './connection'

const createPayments = async (payments: Payments.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.payments') : knex('yaazoru.payments')
    const [newPayments] = await query
      .insert({
        monthlyPayment_id: payments.monthlyPayment_id,
        amount: payments.amount,
        date: payments.date,
        status: payments.status,
        created_at: payments.created_at,
        update_at: payments.update_at,
      })
      .returning('*')
    return newPayments
  } catch (err) {
    throw err
  }
}

const getPayments = async (): Promise<Payments.Model[]> => {
  const knex = getDbConnection()
  try {
    return await knex.select().table('yaazoru.payments')
  } catch (err) {
    throw err
  }
}

const getPaymentsId = async (payments_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.payments').where({ payments_id }).first()
  } catch (err) {
    throw err
  }
}

const getPaymentsByMonthlyPaymentId = async (monthlyPayment_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.payments').where({ monthlyPayment_id })
  } catch (err) {
    throw err
  }
}

const updatePayments = async (payments_id: string, payments: Payments.Model) => {
  const knex = getDbConnection()
  try {
    const updatePayments = await knex('yaazoru.payments')
      .where({ payments_id })
      .update(payments)
      .returning('*')
    if (updatePayments.length === 0) {
      throw { status: 404, message: 'payments not found' }
    }
    return updatePayments[0]
  } catch (err) {
    throw err
  }
}

const deletePayments = async (monthlyPayment_id: string) => {
  // const knex = getDbConnection();
  // try {
  //     const updateMonthlyPayment = await knex('yaazoru.payments')
  //         .where({ monthlyPayment_id })
  //         .update({ status: 'inactive' })
  //         .returning('*');
  //     if (updateMonthlyPayment.length === 0) {
  //         const error: HttpError.Model = {
  //             status: 404,
  //             message: 'monthlyPaytment not found'
  //         }
  //         throw error;
  //     }
  //     return updateMonthlyPayment[0];
  // } catch (err) {
  //     throw err;
  // }
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

const doesPaymentsExist = async (payments_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.payments')
      .select('payments_id')
      .where({ payments_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createPayments,
  getPayments,
  getPaymentsId,
  getPaymentsByMonthlyPaymentId,
  updatePayments,
  deletePayments,
  /* findCustomer,*/ doesPaymentsExist,
}
