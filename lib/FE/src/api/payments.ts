import axios, { AxiosResponse } from "axios";
import { Payments} from "../model/src";

const baseUrl = 'http://localhost:3006/controller/payments';

// GET 
export const getPayments = async (): Promise<Payments.Model[]> => {
    try {        
        // const newToken = await handleTokenRefresh();
        // if (!newToken) {
        //     return {} as MonthlyPaymentManagement.Model;
        // }
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     throw new Error('No token found!');
        // }
        const response: AxiosResponse<Payments.Model[]> = await axios.get(baseUrl, 
        //     {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //     },
        // }
    );
        return response.data;
    } catch (error) {
        console.error("Error get payments", error);
        throw error;
    }
};

// GET monthlyPayment
export const getAllPaymentsByMonthlyPaymentId = async (monthlyPayment_id:string): Promise<Payments.Model[]> => {
    try {        
        // const newToken = await handleTokenRefresh();
        // if (!newToken) {
        //     return {} as MonthlyPaymentManagement.Model;
        // }
        // const token = localStorage.getItem('token');
        // if (!token) {
        //     throw new Error('No token found!');
        // }
        const response: AxiosResponse<Payments.Model[]> = await axios.get(`${baseUrl}/monthlyPayment/${monthlyPayment_id}`, 
        //     {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //     },
        // }
    );
        return response.data;
    } catch (error) {
        console.error("Error get payments by monthlyPayment_id", error);
        throw error;
    }
};