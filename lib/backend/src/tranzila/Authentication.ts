import axios from 'axios';
import generateAccessTokenTranzila from './tranzilaAuth';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './env') });


const appPublicKey = process.env.TRANZILA_PUBLIC_KEY || '';
const appPrivateKey = process.env.TRANZILA_PRIVET_KEY || '';
console.log('appPublicKey', appPublicKey);
console.log('appPrivateKey', appPrivateKey);

const axiosInstance = axios.create({
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
});

const charge = async (transactionData: any) => {
    const { headers } = generateAccessTokenTranzila(appPublicKey, appPrivateKey);
    try {
        await axiosInstance.post('https://api.tranzila.com/v1/transaction/credit_card/create', transactionData, { headers })
            .then(response => {
                console.log('Response:', response.data);
                return response.data;
            })
    } catch (err: any) {
        console.log(err)
        return err;

    }
}
export { charge }


