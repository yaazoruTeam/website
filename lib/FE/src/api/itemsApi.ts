import axios, { AxiosResponse } from 'axios';
import { ItemForMonthlyPayment } from '../model/src';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/item';

export interface PaginatedItemsResponse {
    data: ItemForMonthlyPayment.Model[];
    total: number;
    page: number;
    totalPages: number;
}

// GET עם pagination
export const getItems = async (page: number = 1): Promise<PaginatedItemsResponse> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return { data: [], total: 0, page, totalPages: 0 };
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<PaginatedItemsResponse> = await axios.get(`${baseUrl}?page=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching items", error);
        throw error;
    }
};

// GET לפי monthlyPayment_id עם pagination
export const getItemsByMonthlyPaymentId = async (monthlyPayment_id: string, page: number = 1): Promise<PaginatedItemsResponse> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return { data: [], total: 0, page, totalPages: 0 };
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<PaginatedItemsResponse> = await axios.get(`${baseUrl}/monthlyPayment/${monthlyPayment_id}?page=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching items by monthly payment id", error);
        throw error;
    }
};

