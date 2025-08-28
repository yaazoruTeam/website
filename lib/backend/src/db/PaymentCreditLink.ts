import { Knex } from 'knex'
import { HttpError, PaymentCreditLink } from '@model'
import getDbConnection from '@db/connection'
import config from '@config/index'
const limit = config.database.limit

const createPaymentCreditLink = async (paymentCreditLink: PaymentCreditLink.Model, trx?: Knex.Transaction) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.paymentCreditLink') : knex('yaazoru.paymentCreditLink')
    const [newPaymentCreditLink] = await query
      .insert({
        monthlyPayment_id: paymentCreditLink.monthlyPayment_id,
        creditDetails_id: paymentCreditLink.creditDetails_id,
        status: 'active',
      })
      .returning('*')
    return newPaymentCreditLink
  } catch (err) {
    throw err
  }
}

const getPaymentCreditLinks = async (
  offset: number,
): Promise<{ paymentCreditLinks: PaymentCreditLink.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const paymentCreditLinks = await knex('yaazoru.paymentCreditLink')
      .select('*')
      .orderBy('paymentCreditLink_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.paymentCreditLink').count('*')
    return {
      paymentCreditLinks,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const getPaymentCreditLinkId = async (paymentCreditLink_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.paymentCreditLink').where({ paymentCreditLink_id }).first()
  } catch (err) {
    throw err
  }
}

const getPaymentCreditLinkByMonthlyPaymentId = async (
  monthlyPayment_id: string,
  offset: number,
) => {
  const knex = getDbConnection()
  try {
    const paymentCreditLinks = await knex('yaazoru.paymentCreditLink')
      .select('*')
      .orderBy('paymentCreditLink_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.paymentCreditLink').count('*')
    return {
      paymentCreditLinks,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

// לפי monthlyPayment_id עם pagination
const getPaymentCreditLinksByMonthlyPaymentId = async (
  monthlyPayment_id: string,
  offset: number,
): Promise<{ paymentCreditLinks: PaymentCreditLink.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const paymentCreditLinks = await knex('yaazoru.paymentCreditLink')
      .select('*')
      .where({ monthlyPayment_id })
      .orderBy('paymentCreditLink_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.paymentCreditLink')
      .where({ monthlyPayment_id })
      .count('*')

    return {
      paymentCreditLinks,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

// לפי creditDetails_id עם pagination
const getPaymentCreditLinksByCreditDetailsId = async (
  creditDetails_id: string,
  offset: number,
): Promise<{ paymentCreditLinks: PaymentCreditLink.Model[]; total: number }> => {
  const knex = getDbConnection()
  try {
    const paymentCreditLinks = await knex('yaazoru.paymentCreditLink')
      .select('*')
      .where({ creditDetails_id })
      .orderBy('paymentCreditLink_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.paymentCreditLink')
      .where({ creditDetails_id })
      .count('*')

    return {
      paymentCreditLinks,
      total: parseInt(count as string, 10),
    }
  } catch (err) {
    throw err
  }
}

const updatePaymentCreditLink = async (
  paymentCreditLink_id: string,
  paymentCreditLink: PaymentCreditLink.Model,
) => {
  const knex = getDbConnection()
  try {
    const updatePaymentCreditLink = await knex('yaazoru.paymentCreditLink')
      .where({ paymentCreditLink_id })
      .update(paymentCreditLink)
      .returning('*')
    if (updatePaymentCreditLink.length === 0) {
      throw { status: 404, message: 'paymentCreditLink not found' }
    }
    return updatePaymentCreditLink[0]
  } catch (err) {
    throw err
  }
}

const deletePaymentCreditLink = async (paymentCreditLink_id: string) => {
  const knex = getDbConnection()
  try {
    const updatePaymentCreditLink = await knex('yaazoru.paymentCreditLink')
      .where({ paymentCreditLink_id })
      .update({ status: 'inactive' })
      .returning('*')
    if (updatePaymentCreditLink.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: 'paymentCreditLink not found',
      }
      throw error
    }
    return updatePaymentCreditLink[0]
  } catch (err) {
    throw err
  }
}

// const findCustomer = async (criteria: { customer_id?: string email?: string id_number?: string }) => {
//     const knex = getDbConnection()
//     try {
//         return await knex('yaazoru.customers')
//             .where(function () {
//                 if (criteria.email) {
//                     this.orWhere({ email: criteria.email })
//                 }
//                 if (criteria.id_number) {
//                     this.orWhere({ id_number: criteria.id_number })
//                 }
//             })
//             .andWhere(function () {
//                 if (criteria.customer_id) {
//                     this.whereNot({ customer_id: criteria.customer_id })
//                 }
//             })
//             .first()
//     } catch (err) {
//         throw err
//     }
// }

const doesPaymentCreditLinkExist = async (paymentCreditLink_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.paymentCreditLink')
      .select('paymentCreditLink_id')
      .where({ paymentCreditLink_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

const doesMonthlyPaimentExistInPaymentCreditLink = async (
  monthlyPayment_id: string,
): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.paymentCreditLink')
      .select('monthlyPayment_id')
      .where({ monthlyPayment_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}
const doesCreditDetailsExistInPaymentCreditLink = async (credit_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.paymentCreditLink')
      .select('credit_id')
      .where({ credit_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createPaymentCreditLink,
  getPaymentCreditLinks,
  getPaymentCreditLinkId,
  getPaymentCreditLinksByMonthlyPaymentId,
  getPaymentCreditLinksByCreditDetailsId,
  updatePaymentCreditLink,
  deletePaymentCreditLink,
  doesPaymentCreditLinkExist,
  doesMonthlyPaimentExistInPaymentCreditLink,
  doesCreditDetailsExistInPaymentCreditLink,
}
