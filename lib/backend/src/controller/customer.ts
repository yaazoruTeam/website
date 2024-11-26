import { Request, Response } from 'express';
import db from "../db"
import { sanitize } from "../model/Customer";

const createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const customerData = req.body;
        const sanitized = sanitize(customerData);
        const customer = await db.Customer.createCustomer(sanitized);
        res.status(201).json({ message: 'create customer was successful.' });
    } catch (error: any) {
        console.error('Error in createCustomer:', error.message);
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error creating customer', error: error.message });
        }
    }
};

const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const customers = await db.Customer.getCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
};

export {
    createCustomer, getCustomers
}