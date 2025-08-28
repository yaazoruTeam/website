import axios from 'axios'
import generateAccessTokenTranzila from '@tranzila/tranzilaAuth'
import config from '@config/index'

const appPublicKey = config.tranzila.publicKey
const appPrivateKey = config.tranzila.privateKey

const axiosInstance = axios.create({
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
})

interface TransactionData {
  amount?: number
  currency?: string
  payment_method?: string
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
        console.log('Response:', response.data)
        return response.data
      })
  } catch (err: unknown) {
    console.log(err)
    return err
  }
}
export { charge }
