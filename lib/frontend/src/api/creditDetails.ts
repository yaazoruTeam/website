import axios, { AxiosResponse } from 'axios';
import { CreditDetails } from '../model';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/creditDetails`;
const baseUrl = 'http://localhost:3006/controller/creditDetails';


// POST
export const createCreditDetails = async (creditDetails: CreditDetails.Model): Promise<CreditDetails.Model> => {
    try {
        const newToken = await handleTokenRefresh();
        if (!newToken) {
            return {} as CreditDetails.Model;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found!');
        }
        const response: AxiosResponse<CreditDetails.Model> = await axios.post(baseUrl, creditDetails, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating customer", error);
        throw error;
    }
};
