import axios from 'axios'
import generateAccessTokenTranzila from './tranzilaAuth'
import config from '../config'

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
        console.log('Response:', response.data)
        return response.data
      })
  } catch (err: any) {
    console.log(err)
    return err
  }
}
export { charge }
