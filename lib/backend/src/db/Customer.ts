import { Customer, HttpError } from "../model";
import getConnection from "./connection";



const createCustomer = async (customer: Customer.Model) => {
    const knex = getConnection();
    try {
        const [newCustomer] = await knex('yaazoru.customers')
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
        return await knex.select().table('yaazoru.customers');
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

const updateCustomer = async (customer_id: string, customer: Customer.Model) => {
    const knex = getConnection();
    try {
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
                    this.orWhere({ email: criteria.email });
                }
                if (criteria.id_number) {
                    this.orWhere({ id_number: criteria.id_number });
                }
            })
            .andWhere(function () {
                if (criteria.customer_id) {
                    this.whereNot({ customer_id: criteria.customer_id });
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
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer, findCustomer, doesCustomerExist
}
