import { Customer, HttpError } from "../model";
import getConnection from "./connection";



const createCustomer = async (customer: Customer.Model, trx?: any) => {
    const knex = getConnection();
    try {
        const query = trx ? trx('yaazoru.customers') : knex('yaazoru.customers');
        const [newCustomer] = await query
            .insert({
                first_name: customer.first_name,
                last_name: customer.last_name,
                id_number: customer.id_number,
                phone_number: customer.phone_number,
                additional_phone: customer.additional_phone,
                email: customer.email,
                city: customer.city,
                address1: customer.address1,
                address2: customer.address2,
                zipCode: customer.zipCode,
                created_at: customer.created_at,
                updated_at: customer.updated_at
            }).returning('*');
        return newCustomer;
    }
    catch (err) {
        throw err;
    };
}

const getCustomers = async (): Promise<Customer.Model[]> => {
    const knex = getConnection();
    try {
        return await knex.select()
            .table('yaazoru.customers')
            .orderBy('customer_id');
    }
    catch (err) {
        throw err;
    };
}

const getCustomerById = async (customer_id: string) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.customers').where({ customer_id }).first();
    } catch (err) {
        throw err;
    };
};

const getCustomersByCity = async (city: string): Promise<Customer.Model[]> => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.customers')
            .select('*')
            .where({ city })
            .orderBy('customer_id');
    } catch (err) {
        throw err;
    };
};

const getCustomersByStatus = async (status: 'active' | 'inactive'): Promise<Customer.Model[]> => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.customers')
            .select('*')
            .where({ status })
            .orderBy('customer_id');
    } catch (err) {
        throw err;
    };
};

const getCustomersByDateRange = async (startDate: string, endDate: string): Promise<Customer.Model[]> => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.customers')
            .select('*')
            .whereBetween('created_at', [startDate, endDate])
            .orderBy('customer_id');
    } catch (err) {
        throw err;
    }
};

const updateCustomer = async (customer_id: string, customer: Customer.Model) => {
    const knex = getConnection();
    try {
        customer.updated_at = new Date(Date.now());
        const updateCustomer = await knex('yaazoru.customers')
            .where({ customer_id })
            .update(customer)
            .returning('*');
        if (updateCustomer.length === 0) {
            throw { status: 404, message: 'Customer not found' };
        }
        return updateCustomer[0];
    } catch (err) {
        throw err;
    };
};

const deleteCustomer = async (customer_id: string) => {
    const knex = getConnection();
    try {
        const updateCustomer = await knex('yaazoru.customers')
            .where({ customer_id })
            .update({ status: 'inactive' })
            .returning('*');
        if (updateCustomer.length === 0) {
            const error: HttpError.Model = {
                status: 404,
                message: 'customer not found'
            }
            throw error;
        }
        return updateCustomer[0];
    } catch (err) {
        throw err;
    }
};

const findCustomer = async (criteria: { customer_id?: string; email?: string; id_number?: string; }) => {
    const knex = getConnection();
    try {
        return await knex('yaazoru.customers')
            .where(function () {
                if (criteria.email) {
                    this.where({ email: criteria.email });
                }
                if (criteria.id_number) {
                    this.andWhere({ id_number: criteria.id_number });
                }
            })
            .modify((query) => {
                if (criteria.customer_id) {
                    query.whereNot({ customer_id: criteria.customer_id });
                }
            })
            .first();
    } catch (err) {
        throw err;
    }
};

const doesCustomerExist = async (customer_id: string): Promise<boolean> => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.customers')
            .select('customer_id')
            .where({ customer_id })
            .first();
        return !!result;
    } catch (err) {
        throw err;
    }
};

export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    findCustomer,
    doesCustomerExist,
    getCustomersByCity,
    getCustomersByStatus,
    getCustomersByDateRange
}
