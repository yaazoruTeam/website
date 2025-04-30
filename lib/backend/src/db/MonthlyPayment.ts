import { HttpError, MonthlyPayment } from "../model";
import getConnection from "./connection";



const createMonthlyPayment = async (monthlyPayment: MonthlyPayment.Model, trx?: any) => {
    const knex = getConnection();
    try {
        const query = trx ? trx('yaazoru.monthlyPayment') : knex('yaazoru.monthlyPayment');
        const [newMonthlyPayment] = await query
            .insert({
                customer_id: monthlyPayment.customer_id,
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

const getMonthlyPaymentByStatus = async (status: 'active' | 'inactive') => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.monthlyPayment')
            .select()
            .where({ status });
    } catch (err) {
        throw err;
    };
};

const getMonthlyPaymentByOrganization = async (belongsOrganization: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.monthlyPayment')
            .select()
            .where({ belongsOrganization });
    } catch (err) {
        throw err;
    };
};

const updateMonthlyPayment = async (monthlyPayment_id: string, monthlyPayment: MonthlyPayment.Model, trx?: any) => {
    const knex = getConnection();
    try {
        const query = trx ? trx('yaazoru.monthlyPayment') : knex('yaazoru.monthlyPayment');
        const updateMonthlyPayment = await query
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

const deleteMonthlyPayment = async (monthlyPayment_id: string) => {
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
    createMonthlyPayment,
    getMonthlyPayment,
    getMonthlyPaymentId,
    updateMonthlyPayment,
    deleteMonthlyPayment,
    /* findCustomer,*/
    doesMonthlyPaymentExist,
    getMonthlyPaymentByStatus,
    getMonthlyPaymentByOrganization,
};
