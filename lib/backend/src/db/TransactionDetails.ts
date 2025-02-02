import { TransactionDetails, HttpError } from "../model";
import getConnection from "./connection";

const createTransactionDetails = async (
  transactionDetails: TransactionDetails.Model
) => {
  const knex = getConnection();
  try {
    const [newTransactionDetails] = await knex("yaazoru.transactionDetails")
      .insert({
        credit_id: transactionDetails.credit_id,
        customer_name: transactionDetails.customer_name,
        dates: transactionDetails.dates,
        amount: transactionDetails.amount,
        total_sum: transactionDetails.total_sum,
        belongs_to_organization: transactionDetails.belongs_to_organization,
        last_attempt: transactionDetails.last_attempt,
        last_success: transactionDetails.last_success,
        next_charge: transactionDetails.next_charge,
        update: transactionDetails.update,
        items: transactionDetails.items,
        status: "active",
      })
      .returning("*");
    return newTransactionDetails;
  } catch (err) {
    throw err;
  }
};

const getTransactionDetails = async (): Promise<TransactionDetails.Model[]> => {
  const knex = getConnection();
  try {
    return await knex.select().table("yaazoru.transactionDetails");
  } catch (err) {
    throw err;
  }
};

const getTransactionDetailsById = async (transaction_id: string) => {
  const knex = getConnection();
  try {
    return await knex("yaazoru.transactionDetails")
      .where({ transaction_id })
      .first();
  } catch (err) {
    throw err;
  }
};

const updateTransactionDetails = async (
  transaction_id: string,
  transactionDetails: TransactionDetails.Model
) => {
  const knex = getConnection();
  try {
    const updateTransactionDetails = await knex("yaazoru.transactionDetails")
      .where({ transaction_id })
      .update(transactionDetails)
      .returning("*");
    if (updateTransactionDetails.length === 0) {
      throw { status: 404, message: "TransactionDetails not found" };
    }
    return updateTransactionDetails[0];
  } catch (err) {
    throw err;
  }
};

const deleteTransactionDetails = async (transaction_id: string) => {
  const knex = getConnection();
  try {
    const updateTransactionDetails = await knex("yaazoru.transactionDetails")
      .where({ transaction_id })
      .update({ status: "inactive" })
      .returning("*");
    if (updateTransactionDetails.length === 0) {
      const error: HttpError.Model = {
        status: 404,
        message: "TransactionDetails not found",
      };
      throw error;
    }
    return updateTransactionDetails[0];
  } catch (err) {
    throw err;
  }
};

const doesTransactionDetailsExist = async (
  transaction_id: string
): Promise<boolean> => {
  const knex = getConnection();
  try {
    const result = await knex("yaazoru.transactionDetails")
      .select("transaction_id")
      .where({ transaction_id })
      .first();
    return !!result;
  } catch (err) {
    throw err;
  }
};

export {
  createTransactionDetails,
  getTransactionDetails,
  getTransactionDetailsById,
  updateTransactionDetails,
  deleteTransactionDetails,
  doesTransactionDetailsExist,
};
