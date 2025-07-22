import { HttpError, MonthlyPayment } from '@model'
import getDbConnection from './connection'
import config from '@/config'

const limit = config.database.limit

const createMonthlyPayment = async (monthlyPayment: MonthlyPayment.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.monthlyPayment') : knex('yaazoru.monthlyPayment')
    const [newMonthlyPayment] = await query
      .insert({
        customer_id: monthlyPayment.customer_id,
        customer_name: monthlyPayment.customer_name,
        belongsOrganization: monthlyPayment.belongsOrganization,
        start_date: monthlyPayment.start_date,
        end_date: monthlyPayment.end_date,
        amount: monthlyPayment.amount,
        total_amount: monthlyPayment.total_amount,
        oneTimePayment: monthlyPayment.oneTimePayment,
        frequency: monthlyPayment.frequency,
        amountOfCharges: monthlyPayment.amountOfCharges,
        dayOfTheMonth: monthlyPayment.frequency,
        next_charge: monthlyPayment.next_charge,
        last_attempt: monthlyPayment.last_attempt,
        last_sucsse: monthlyPayment.last_sucsse,
        created_at: monthlyPayment.created_at,
        update_at: monthlyPayment.update_at,
      })
      .returning('*')
    return newMonthlyPayment
  } catch (err) {
    throw err
  }
}

const getMonthlyPayments = async (
  offset: number,
): Promise<{ monthlyPayments: MonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const monthlyPayments = await knex('yaazoru.monthlyPayment')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('monthlyPayment_id')

    const [{ count }] = await knex('yaazoru.monthlyPayment').count('*')

    return {
      monthlyPayments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getMonthlyPaymentById = async (monthlyPayment_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.monthlyPayment').where({ monthlyPayment_id }).first()
  } catch (err) {
    throw err
  }
}

const getMonthlyPaymentsByCustomerId = async (
  customer_id: string,
  offset: number,
): Promise<{ monthlyPayments: MonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const monthlyPayments = await knex('yaazoru.monthlyPayment')
      .select('*')
      .where({ customer_id })
      .orderBy('monthlyPayment_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.monthlyPayment').count('*').where({ customer_id })

    return {
      monthlyPayments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getMonthlyPaymentsByStatus = async (
  status: 'active' | 'inactive',
  offset: number,
): Promise<{ monthlyPayments: MonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const monthlyPayments = await knex('yaazoru.monthlyPayment')
      .select('*')
      .where({ status })
      .orderBy('monthlyPayment_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.monthlyPayment').count('*').where({ status })

    return {
      monthlyPayments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getMonthlyPaymentsByOrganization = async (
  belongsOrganization: string,
  offset: number,
): Promise<{ monthlyPayments: MonthlyPayment.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const monthlyPayments = await knex('yaazoru.monthlyPayment')
      .select('*')
      .where({ belongsOrganization })
      .orderBy('monthlyPayment_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.monthlyPayment')
      .count('*')
      .where({ belongsOrganization })

    return {
      monthlyPayments,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updateMonthlyPayment = async (
  monthlyPayment_id: string,
  monthlyPayment: MonthlyPayment.Model,
  trx?: any,
) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.monthlyPayment') : knex('yaazoru.monthlyPayment')
    const updateMonthlyPayment = await query
      .where({ monthlyPayment_id })
      .update(monthlyPayment)
      .returning('*')
    if (updateMonthlyPayment.length === 0) {
      throw { status: 404, message: 'monthlyPayment not found' }
    }
    return updateMonthlyPayment[0]
  } catch (err) {
    throw err
  }
}

const deleteMonthlyPayment = async (monthlyPayment_id: string) => {
  const knex = getDbConnection()
  try {
    const updateMonthlyPayment = await knex('yaazoru.monthlyPayment')
      .where({ monthlyPayment_id })
      .update({ status: 'inactive' })
      .returning('*')
    if (updateMonthlyPayment.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'monthlyPaytment not found',
      }
      throw error
    }
    return updateMonthlyPayment[0]
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

const doesMonthlyPaymentExist = async (monthlyPayment_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.monthlyPayment')
      .select('monthlyPayment_id')
      .where({ monthlyPayment_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createMonthlyPayment,
  getMonthlyPayments,
  getMonthlyPaymentById,
  getMonthlyPaymentsByCustomerId,
  updateMonthlyPayment,
  deleteMonthlyPayment,
  /* findCustomer,*/
  doesMonthlyPaymentExist,
  getMonthlyPaymentsByStatus,
  getMonthlyPaymentsByOrganization,
}
