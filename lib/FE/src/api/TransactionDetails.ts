import axios, { AxiosResponse } from 'axios'
import { TransactionDetails } from '../model/src'
import { handleTokenRefresh } from './token'

// const baseUrl = `${process.env.BASE_URL}/transactionDetails`;
const baseUrl = 'http://localhost:3006/controller/transactionDetails'

// POST
export const createTransactionDetails = async (
  transactionDetails: TransactionDetails.Model,
): Promise<TransactionDetails.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as TransactionDetails.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<TransactionDetails.Model> = await axios.post(
      baseUrl,
      transactionDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating customer', error)
    throw error
  }
}
