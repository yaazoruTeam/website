import axios, { AxiosResponse } from 'axios'
import { Payments } from '@model'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/payments`

export interface PaginatedPaymentsResponse {
  data: Payments.Model[];
  total: number;
  page?: number;
  totalPages: number;
}

// GET 
export const getPayments = async (page: number = 1): Promise<PaginatedPaymentsResponse> => {
  try {
    // const newToken = await handleTokenRefresh();
    // if (!newToken) {
    //     return {} as MonthlyPaymentManagement.Model;
    // }
    // const token = localStorage.getItem('token');
    // if (!token) {
    //     throw new Error('No token found!');
    // }
    const response: AxiosResponse<PaginatedPaymentsResponse> = await axios.get(`${baseUrl}?page=${page}`,
      //     {
      //     headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${token}`,
      //     },
      // }
    );
    return response.data
  } catch (error) {
    console.error('Error get payments', error)
    throw error
  }
}

// GET monthlyPayment
export const getAllPaymentsByMonthlyPaymentId = async (monthlyPayment_id: string): Promise<Payments.Model[]> => {
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
    )
    return response.data
  } catch (error) {
    console.error('Error get payments by monthlyPayment_id', error)
    throw error
  }
}