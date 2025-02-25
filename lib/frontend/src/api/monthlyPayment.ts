import axios, { AxiosResponse } from 'axios';
import {  MonthlyPaymentManagement } from '../model';
import { handleTokenRefresh } from './token';


// const baseUrl = `${process.env.BASE_URL}/customer`;
const baseUrl = 'http://localhost:3006/controller/addMonthlyPayment';

// POST
export const createMonthlyPayment = async (monthlyPayment: MonthlyPaymentManagement.Model): Promise<MonthlyPaymentManagement.Model> => {
    try {
        console.log('create monthly payment in frontend');
        
        // const newToken = await handleTokenRefresh();
        // if (!newToken) {
        //     return {} as MonthlyPaymentManagement.Model;
        // }
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     throw new Error('No token found!');
        // }
        const response: AxiosResponse<MonthlyPaymentManagement.Model> = await axios.post(baseUrl, monthlyPayment, 
        //     {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //     },
        // }
    );
        return response.data;
    } catch (error) {
        console.error("Error creating monthly payment", error);
        throw error;
    }
};
