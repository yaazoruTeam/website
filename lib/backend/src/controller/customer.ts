import { Request, Response } from 'express';
import * as customerService from '../service/customer';


const createCustomer = async (req: Request, res: Response): Promise<void> => {
    console.log("customer controller");
    
    try {
        const customerData = req.body;
        if (!customerData.first_name || !customerData.last_name || !customerData.id_number || !customerData.phone_number || !customerData.email || !customerData.city || !customerData.street || !customerData.building_number || !customerData.apartment_number) {
            res.status(400).json({ message: 'first_name, last_name, id_number, phone_number, email, city, street, building_number and apartment_number are required' });
        }
        const customer = await customerService.createCustomer();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
};

const getCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
        const customers = await customerService.getCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
};

export {
    createCustomer, getCustomers
}