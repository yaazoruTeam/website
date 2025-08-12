import axios from 'axios'
import generateAccessTokenTranzila from '@tranzila/tranzilaAuth'
import config from '@config/index'
import logger from '../utils/logger'

const appPublicKey = config.tranzila.publicKey
const appPrivateKey = config.tranzila.privateKey

const axiosInstance = axios.create({
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
})

const charge = async (transactionData: any) => {
  const { headers } = generateAccessTokenTranzila(appPublicKey, appPrivateKey)
  try {
    await axiosInstance
      .post('https://api.tranzila.com/v1/transaction/credit_card/create', transactionData, {
        headers,
      })
      .then((response) => {
       logger.info('Response:', response.data)
        return response.data
      })
  } catch (err: any) {
    logger.error(err)
    return err
  }
}
export { charge }
