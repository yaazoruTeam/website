import axios, { AxiosResponse } from 'axios';
import { MonthlyPayment } from '../model/src';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/monthlyPayment';

// GET
export const getMonthlyPayment = async (): Promise<MonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<MonthlyPayment.Model[]> = await axios.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly payments", error);
        throw error;
    }
};

// GET(id)
export const getMonthlyPaymentById = async (monthlyPayment_id: string): Promise<MonthlyPayment.Model> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return {} as MonthlyPayment.Model;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<MonthlyPayment.Model> = await axios.get(`${baseUrl}/${monthlyPayment_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly payment id", error);
        throw error;
    }
};

// GET(customer_id)
export const getMonthlyPaymentByCustomerId = async (customer_id: string): Promise<MonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<MonthlyPayment.Model[]> = await axios.get(`${baseUrl}/customer/${customer_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching all monthly payments by customer id", error);
        throw error;
    }
}

// GET(status)
export const getMonthlyPaymentByStatus = async (status: 'active' | 'inactive'): Promise<MonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return {} as MonthlyPayment.Model[];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<MonthlyPayment.Model[]> = await axios.get(`${baseUrl}/status/${status}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly payments by status", error);
        throw error;
    }
};

// GET(organization)
export const getMonthlyPaymentByOrganization = async (organization: string): Promise<MonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return {} as MonthlyPayment.Model[];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<MonthlyPayment.Model[]> = await axios.get(`${baseUrl}/organization/${organization}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly payments by organization", error);
        throw error;
    }
};

