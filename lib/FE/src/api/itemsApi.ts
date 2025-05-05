import axios, { AxiosResponse } from 'axios';
import { ItemForMonthlyPayment } from '../model/src';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/item';

// GET
export const getItems = async (): Promise<ItemForMonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<ItemForMonthlyPayment.Model[]> = await axios.get(baseUrl, {
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

// GET
export const getItemsByMonthlyPaymentId = async (monthlyPayment_id:string): Promise<ItemForMonthlyPayment.Model[]> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return [];
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<ItemForMonthlyPayment.Model[]> = await axios.get(`${baseUrl}/monthlyPayment/${monthlyPayment_id}`, {
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

