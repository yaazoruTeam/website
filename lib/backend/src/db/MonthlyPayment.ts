import { HttpError, MonthlyPayment } from "../model";
import getConnection from "./connection";



const createMonthlyPayment = async (monthlyPayment: MonthlyPayment.Model) => {
    const knex = getConnection();
    try {
        const [newMonthlyPayment] = await knex('yaazoru.monthlyPayment')
            .insert({
                customer_id: monthlyPayment.customer_id,
                start_date: monthlyPayment.start_date,
                total_amount: monthlyPayment.total_amount,
                frequency: monthlyPayment.frequency,
                next_charge: monthlyPayment.next_charge,
                last_attempt: monthlyPayment.last_attempt,
                last_sucsse: monthlyPayment.last_sucsse,
                created_at: monthlyPayment.created_at,
                update_at: monthlyPayment.update_at,
            }).returning('*');
        return newMonthlyPayment;
    }
    catch (err) {
        throw err;
    };
}

const getMonthlyPayment = async (): Promise<MonthlyPayment.Model[]> => {
    const knex = getConnection();
    try {
        return await knex.select().table('yaazoru.monthlyPayment');
    }
    catch (err) {
        throw err;
    };
}

const getMonthlyPaymentId = async (monthlyPayment_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.monthlyPayment').where({ monthlyPayment_id }).first();
    } catch (err) {
        throw err;
    };
};

const updateMonthlyPayment = async (monthlyPayment_id: string, monthlyPayment: MonthlyPayment.Model) => {
    const knex = getConnection();
    try {
        const updateMonthlyPayment = await knex('yaazoru.monthlyPayment')
            .where({ monthlyPayment_id })
            .update(monthlyPayment)
            .returning('*');
        if (updateMonthlyPayment.length === 0) {
            throw { status: 404, message: 'monthlyPayment not found' };
        }
        return updateMonthlyPayment[0];
    } catch (err) {
        throw err;
    };
};

const deleteMonthlyPayment= async (monthlyPayment_id: string) => {
    const knex = getConnection();
    try {
        const updateMonthlyPayment = await knex('yaazoru.monthlyPayment')
            .where({ monthlyPayment_id })
            .update({ status: 'inactive' })
            .returning('*');
        if (updateMonthlyPayment.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'monthlyPaytment not found'
            }
            throw error;
        }
        return updateMonthlyPayment[0];
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

const doesMonthlyPaymentExist = async (monthlyPayment_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.monthlyPayment')
            .select('monthlyPayment_id')
            .where({ monthlyPayment_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

export {
    createMonthlyPayment, getMonthlyPayment, getMonthlyPaymentId, updateMonthlyPayment, deleteMonthlyPayment,/* findCustomer,*/ doesMonthlyPaymentExist
};
