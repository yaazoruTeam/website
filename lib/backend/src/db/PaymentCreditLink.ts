import { HttpError, PaymentCreditLink } from "../model";
import getConnection from "./connection";



const createPaymentCreditLink = async (paymentCreditLink: PaymentCreditLink.Model, trx?: any) => {
    const knex = getConnection();
    try {
        const query = trx ? trx('yaazoru.paymentCreditLink') : knex('yaazoru.paymentCreditLink');
        const [newPaymentCreditLink] = await query
            .insert({
                monthlyPayment_id: paymentCreditLink.monthlyPayment_id,
                creditDetails_id: paymentCreditLink.creditDetails_id,
                status: 'active',
            }).returning('*');
        return newPaymentCreditLink;
    }
    catch (err) {
        throw err;
    };
}

const getPaymentCreditLink = async (): Promise<PaymentCreditLink.Model[]> => {
    const knex = getConnection();
    try {
        return await knex.select().table('yaazoru.paymentCreditLink');
    }
    catch (err) {
        throw err;
    };
}

const getPaymentCreditLinkId = async (paymentCreditLink_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.paymentCreditLink').where({ paymentCreditLink_id }).first();
    } catch (err) {
        throw err;
    };
};

const updatePaymentCreditLink = async (paymentCreditLink_id: string, paymentCreditLink: PaymentCreditLink.Model) => {
    const knex = getConnection();
    try {
        const updatePaymentCreditLink = await knex('yaazoru.paymentCreditLink')
            .where({ paymentCreditLink_id })
            .update(paymentCreditLink)
            .returning('*');
        if (updatePaymentCreditLink.length === 0) {
            throw { status: 404, message: 'paymentCreditLink not found' };
        }
        return updatePaymentCreditLink[0];
    } catch (err) {
        throw err;
    };
};

const deletePaymentCreditLink = async (paymentCreditLink_id: string) => {
    const knex = getConnection();
    try {
        const updatePaymentCreditLink = await knex('yaazoru.paymentCreditLink')
            .where({ paymentCreditLink_id })
            .update({ status: 'inactive' })
            .returning('*');
        if (updatePaymentCreditLink.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'paymentCreditLink not found'
            }
            throw error;
        }
        return updatePaymentCreditLink[0];
    } catch (err) {
        throw err;
    }
};

// const findCustomer = async (criteria: { customer_id?: string; email?: string; id_number?: string; }) => {
//     const knex = getConnection();
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

const doesPaymentCreditLinkExist = async (paymentCreditLink_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.paymentCreditLink')
            .select('paymentCreditLink_id')
            .where({ paymentCreditLink_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

const doesMonthlyPaimentExistInPaymentCreditLink = async (monthlyPayment_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.paymentCreditLink')
            .select('monthlyPayment_id')
            .where({ monthlyPayment_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

export {
    createPaymentCreditLink, getPaymentCreditLink, getPaymentCreditLinkId, updatePaymentCreditLink, deletePaymentCreditLink,/* findCustomer,*/ doesPaymentCreditLinkExist, doesMonthlyPaimentExistInPaymentCreditLink
};
