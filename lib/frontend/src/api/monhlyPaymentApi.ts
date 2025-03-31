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
        console.error("Error fetching monthly payment", error);
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
        console.error("Error fetching monthly payment", error);
        throw error;
    }
};

