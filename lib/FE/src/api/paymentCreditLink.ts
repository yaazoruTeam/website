import axios, { AxiosResponse } from 'axios'
import { PaymentCreditLink } from '../model/src'
import { handleTokenRefresh } from './token'

const baseUrl = 'http://localhost:3006/controller/paymentCreditLink'

// GET monthlyPayment_id
export const getPaymentCreditLinkByMonthlyPaymentId = async (
  monthlyPayment_id: string,
): Promise<PaymentCreditLink.Model> => {
  try {
    const newToken = await handleTokenRefresh()
    if (!newToken) {
      return {} as PaymentCreditLink.Model
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found!')
    }
    const response: AxiosResponse<PaymentCreditLink.Model> = await axios.get(
      `${baseUrl}/monthlyPayment/${monthlyPayment_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error get payment credit link by monthly payment', error)
    throw error
  }
}
