import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { Customer } from "@yaazoru/model";
import { handleError } from '../middleware';

const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const customerData = req.body;
        const sanitized = Customer.sanitize(customerData, false);
        await existingCustomer(sanitized, false);
        const customer = await db.Customer.createCustomer(sanitized);
        res.status(201).json(customer);
    } catch (error: any) {
        handleError(res, error);
    }
};

const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const customers = await db.Customer.getCustomers();
        res.status(200).json(customers);
    } catch (error: any) {
        handleError(res, error)
    }
};

const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.params.id)
            throw {
                status: 400,
                message: 'No ID provided'
            };
        const customer = await db.Customer.getCustomerById(req.params.id);
        if (!customer) {
            return next({
                status: 404,
                message: 'customer not found'
            });
        }
        res.status(200).json(customer);
    } catch (error: any) {
        handleError(res, error);
    }
};

const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body)
            throw {
                status: 400,
                message: 'No body provaider'
            }
        const sanitized = Customer.sanitize(req.body, true);
        await existingCustomer(sanitized, true);
        const updateCustomer = await db.Customer.updateCustomer(req.params.id, sanitized);
        res.status(200).json(updateCustomer);
    } catch (error: any) {
        handleError(res, error);
    }
};

const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.id)
            throw {
                status: 400,
                message: 'No ID provided'
            };
        const customer = await db.Customer.getCustomerById(req.params.id);

        if (!customer) {
            throw {
                status: 404,
                message: 'customer not found'
            };
        }
        const deleteCustomer = await db.Customer.deleteCustomer(req.params.id);
        res.status(200).json(deleteCustomer);
    } catch (error: any) {
        handleError(res, error);
    }
};

const existingCustomer = async (customer: Customer.Model, hasId: boolean) => {
    let customerEx;
    if (hasId) {
        customerEx = await db.Customer.findCustomer({
            customer_id: customer.customer_id,
            email: customer.email,
            id_number: customer.id_number
        });
    } else {
        customerEx = await db.Customer.findCustomer({
            customer_id: customer.customer_id,
            email: customer.email,
            id_number: customer.id_number
        });
    }
    if (customerEx) {
        if (customerEx.id_number === customer.id_number) {
            throw {
                status: 409,
                message: 'id_number already exists',
            };
        }
        if (customerEx.email === customer.email) {
            throw {
                status: 409,
                message: 'email already exists',
            };
        }
    };
};

export {
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer,
}
