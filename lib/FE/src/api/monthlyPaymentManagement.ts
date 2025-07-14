import axios, { AxiosResponse } from 'axios'
import { MonthlyPaymentManagement } from '../model/src'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/addMonthlyPayment`

// POST
export const createMonthlyPayment = async (
  monthlyPayment: MonthlyPaymentManagement.Model,
): Promise<MonthlyPaymentManagement.Model> => {
  try {
    console.log('create monthly payment in frontend')

    // const newToken = await handleTokenRefresh();
    // if (!newToken) {
    //     return {} as MonthlyPaymentManagement.Model;
    // }
    // const token = localStorage.getItem('token');
    // if (!token) {
    //     throw new Error('No token found!');
    // }
    const response: AxiosResponse<MonthlyPaymentManagement.Model> = await axios.post(
      baseUrl,
      monthlyPayment,
      //     {
      //     headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${token}`,
      //     },
      // }
    )
    return response.data
  } catch (error) {
    console.error('Error creating monthly payment', error)
    throw error
  }
}

// PUT
export const updateMonthlyPayment = async (
  monthlyPayment: MonthlyPaymentManagement.Model,
  monthlyPayment_id: string,
): Promise<AxiosResponse> => {
  try {
    console.log('update monthly payment in frontend')

    // const newToken = await handleTokenRefresh();
    // if (!newToken) {
    //     return {} as MonthlyPaymentManagement.Model;
    // }
    // const token = localStorage.getItem('token');
    // if (!token) {
    //     throw new Error('No token found!');
    // }
    const baseUrl = `${import.meta.env.VITE_BASE_URL}/updateMonthlyPayment/${monthlyPayment_id}`

    const response: AxiosResponse<MonthlyPaymentManagement.Model> = await axios.put(
      baseUrl,
      monthlyPayment,
      //     {
      //     headers: {
      //         'Content-Type': 'application/json',
      //         Authorization: `Bearer ${token}`,
      //     },
      // }
    )
    return response
  } catch (error) {
    console.error('Error update monthly payment', error)
    throw error
  }
}
