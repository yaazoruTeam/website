import axios from 'axios'
import generateAccessTokenTranzila from '@tranzila/tranzilaAuth'
import config from '@config/index'
import logger from '../utils/logger'

const appPublicKey = config.tranzila.publicKey
const appPrivateKey = config.tranzila.privateKey

const axiosInstance = axios.create({
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
})

interface TransactionData {
  terminal_name: string
  expire_month: number
  expire_year: number
  cvv: string
  card_number: string
  items: Array<{
    name: string
    type: string
    unit_price: number
    units_number: number
  }>
  [key: string]: unknown
}

const charge = async (transactionData: TransactionData) => {
  const { headers } = generateAccessTokenTranzila(appPublicKey, appPrivateKey)
  try {
    await axiosInstance
      .post('https://api.tranzila.com/v1/transaction/credit_card/create', transactionData, {
        headers,
      })
      .then((response) => {
      return response.data
      })
  } catch (err: unknown) {
    logger.error(err)
    return err
  }
}
export { charge }
