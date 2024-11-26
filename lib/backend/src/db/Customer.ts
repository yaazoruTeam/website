import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Customer } from "../model/Customer";
import createError from 'http-errors';
import getConnection from "./connection";



const createCustomer = async (customer: Customer) => {
    const knex = getConnection();
    try {
        await knex('yaazoru.customers')
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
            })
    }
    catch (err: any) {
        if (err.code === '23505') {
            if (err.detail?.includes('email')) {
                throw {
                    status: 409,
                    message: 'Email already exists',
                };
            }
            if (err.detail?.includes('id_number')) {
                throw {
                    status: 409,
                    message: 'ID number already exists',
                };
            }
        }
        throw {
            status: 500,
            message: 'Database error',
        };
    }
}

const getCustomers = async () => {
    const knex = getConnection();
    try {
        return await knex.select().table('yaazoru.customers');
    }
    catch (err) {
        return err;
        // console.error('DB: get all customers', err);
    }
}

export {
    createCustomer, getCustomers,
}