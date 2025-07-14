import axios, { AxiosResponse } from 'axios'
import { TransactionDetails } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/transactionDetails`

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
