import axios, { AxiosResponse } from 'axios'
import { CreditDetails } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = `${import.meta.env.VITE_BASE_URL}/creditDetails`

// POST
export const createCreditDetails = async (
  creditDetails: CreditDetails.Model,
): Promise<CreditDetails.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as CreditDetails.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<CreditDetails.Model> = await axios.post(baseUrl, creditDetails, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating customer', error)
    throw error
  }
}

// GET id
export const getCreditDetailsById = async (
  creditDetails_id: string,
): Promise<CreditDetails.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as CreditDetails.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<CreditDetails.Model> = await axios.get(
      `${baseUrl}/${creditDetails_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error get cedit deatails by id.', error)
    throw error
  }
}
