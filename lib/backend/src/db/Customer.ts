import { Customer } from "../model/Customer";
import getConnection from "./connection";



const createCustomer = async (customer: Customer) => {
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

const getCustomers = async (): Promise<Customer[]> => {
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

const updateCustomer = async (id: string, customer: Customer) => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.customers')
            .where({ id })
            .update(customer);
        if (result === 0) {
            throw { status: 404, message: 'Customer not found' };
        }
        console.log(result);
        
        return result;
    } catch (err) {
        throw err;
    };
};

const deleteCustomer = async (id: string) => {
    const knex = getConnection();
    try {
        const result = await knex('yaazoru.customers').where({ id }).del();
        if (result === 0) {
            throw { status: 404, message: 'Customer not found' };
        }
    } catch (err) {
        throw err;
    };
};

export {
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer
}
