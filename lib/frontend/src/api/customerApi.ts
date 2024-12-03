import axios, { AxiosResponse } from 'axios';
import { Customer } from '../model';

const baseUrl = 'http://localhost:3006/controller/customer';

// GET
export const getCustomers = async (): Promise<Customer.Model[]> => {
    try {
        const response: AxiosResponse<Customer.Model[]> = await axios.get(baseUrl);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching customers", error);
        throw error;
    }
};

// POST
export const createCustomer = async (customerData: Customer.Model): Promise<Customer.Model> => {
    try {
        const response: AxiosResponse<Customer.Model> = await axios.post(baseUrl, customerData);
        return response.data;
    } catch (error) {
        console.error("Error creating customer", error);
        throw error;
    }
};

// PUT
export const updateCustomer = async (customerId: number, customerData: Customer.Model): Promise<Customer.Model> => {
    try {
        const response: AxiosResponse<Customer.Model> = await axios.put(`${baseUrl}/${customerId}`, customerData);
        return response.data;
    } catch (error) {
        console.error("Error updating customer", error);
        throw error;
    }
};

// DELETE
export const deleteCustomer = async (customerId: number): Promise<void> => {
    try {
        await axios.delete(`${baseUrl}/${customerId}`);
    } catch (error) {
        console.error("Error deleting customer", error);
        throw error;
    }
};
