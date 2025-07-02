import { CreditDetails, HttpError } from '@/model/src'
import getDbConnection from './connection'

const limit = Number(process.env.LIMIT) || 10

const createCreditDetails = async (creditDetails: CreditDetails.Model, trx?: any) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.creditDetails') : knex('yaazoru.creditDetails')
    const [newCreditDetails] = await query
      .insert({
        customer_id: creditDetails.customer_id,
        token: creditDetails.token,
        expiry_month: creditDetails.expiry_month,
        expiry_year: creditDetails.expiry_year,
        created_at: creditDetails.created_at,
        update_at: creditDetails.update_at,
      })
      .returning('*')
    return newCreditDetails
  } catch (err) {
    throw err
  }
}

const getCreditDetails = async (offset: number): Promise<{ creditDetails: CreditDetails.Model[], total: number }> => {
  const knex = getDbConnection()
  try {
    const creditDetails = await knex('yaazoru.creditDetails')
      .select('*')
      .orderBy('credit_id')
      .limit(limit)
      .offset(offset)

    const [{ count }] = await knex('yaazoru.creditDetails').count('*')
    return {
      creditDetails,
      total: parseInt(count as string, 10)
    }
  } catch (err) {
    throw err
  }
}

const getCreditDetailsById = async (credit_id: string) => {
  const knex = getDbConnection()
  try {
    return await knex('yaazoru.creditDetails').where({ credit_id }).first()
  } catch (err) {
    throw err
  }
}

const updateCreditDetails = async (
  credit_id: string,
  creditDetails: CreditDetails.Model,
  trx?: any,
) => {
  const knex = getDbConnection()
  try {
    const query = trx ? trx('yaazoru.creditDetails') : knex('yaazoru.creditDetails')
    const updateCreditDetails = await query
      .where({ credit_id })
      .update(creditDetails)
      .returning('*')
    if (updateCreditDetails.length === 0) {
      throw { status: 404, message: 'CreditDetails not found' }
    }
    return updateCreditDetails[0]
  } catch (err) {
    throw err
  }
}

// const deleteCrCreditDetails = async (credit_id: string) => {
//   const knex = getDbConnection();
//   try {
//     const updateCreditDetails = await knex("yaazoru.creditDetails")
//       .where({ credit_id })
//       .update({ status: "inactive" })
//       .returning("*");
//     if (updateCreditDetails.length === 0) {
//       const error: HttpError.Model = {
//         status: 404,
//         message: "CreditDetails not found",
//       };
//       throw error;
//     }
//     return updateCreditDetails[0];
//   } catch (err) {
//     throw err;
//   }
// };

const doesCreditDetailsExist = async (credit_id: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.creditDetails')
      .select('credit_id')
      .where({ credit_id })
      .first()
    return !!result
  } catch (err) {
    throw err
  }
}

const doesTokenExist = async (token: string): Promise<boolean> => {
  const knex = getDbConnection()
  try {
    const result = await knex('yaazoru.creditDetails').select('token').where({ token }).first()
    return !!result
  } catch (err) {
    throw err
  }
}

export {
  createCreditDetails,
  getCreditDetails,
  getCreditDetailsById,
  updateCreditDetails,
  //   deleteCrCreditDetails,
  doesCreditDetailsExist,
  doesTokenExist,
}
