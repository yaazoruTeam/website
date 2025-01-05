import { NextFunction, Request, Response } from 'express';
import db from "../db";
import { Customer, HttpError } from "../model";

const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Customer.sanitizeBodyExisting(req);
        const customerData = req.body;
        const sanitized = Customer.sanitize(customerData, false);
        await existingCustomer(sanitized, false);
        const customer = await db.Customer.createCustomer(sanitized);
        res.status(201).json(customer);
    } catch (error: any) {
        next(error);
    }
};

const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const customers = await db.Customer.getCustomers();
        res.status(200).json(customers);
    } catch (error: any) {
        next(error);
    }
};

const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Customer.sanitizeIdExisting(req);
        const existCustomer = await db.Customer.doesCustomerExist(req.params.id);
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Customer does not exist.'
            };
            throw error;
        }
        const customer = await db.Customer.getCustomerById(req.params.id);
        res.status(200).json(customer);
    } catch (error: any) {
        next(error);
    }
};

const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Customer.sanitizeIdExisting(req);
        Customer.sanitizeBodyExisting(req);
        const sanitized = Customer.sanitize(req.body, true);
        await existingCustomer(sanitized, true);
        const updateCustomer = await db.Customer.updateCustomer(req.params.id, sanitized);
        res.status(200).json(updateCustomer);
    } catch (error: any) {
        next(error);
    }
};

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        Customer.sanitizeIdExisting(req);
        const existCustomer = await db.Customer.doesCustomerExist(req.params.id);
        if (!existCustomer) {
            const error: HttpError.Model = {
                status: 404,
                message: 'Customer does not exist.'
            };
            throw error;
        }
        const deleteCustomer = await db.Customer.deleteCustomer(req.params.id);
        res.status(200).json(deleteCustomer);
    } catch (error: any) {
        next(error);
    }
};

const existingCustomer = async (customer: Customer.Model, hasId: boolean) => {
    try {
        let customerEx;
        if (hasId) {
            customerEx = await db.Customer.findCustomer({
                customer_id: customer.customer_id,
                email: customer.email,
                id_number: customer.id_number
            });
        } else {
            customerEx = await db.Customer.findCustomer({
                email: customer.email,
                id_number: customer.id_number
            });
        }
        if (customerEx) {
            try {
                Customer.sanitizeExistingCustomer(customerEx, customer);
            } catch (err) {
                throw err;
            }
        };
    } catch (err) {
        throw err;
    }
};


export {
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer,
}
