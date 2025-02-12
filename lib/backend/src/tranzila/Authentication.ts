import axios from 'axios';
import generateAccessToken from './tranzilaAuth';  // מייבאים את הפונקציה שיצרנו קודם
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './env') });  // טוען את הערכים מקובץ ה-.env


const appPublicKey = process.env.TRANZILA_PUBLIC_KEY || 'HMgKoXN8gBnNQUarMOl3viBISu9CSSCszzVy0B8thseuoEwCAQrG231E9AfObNTc51Y0yVnnEX4';
const appPrivateKey = process.env.TRANZILA_PRIVET_KEY || 'TfxLHTDkIn';
console.log('appPublicKey', appPublicKey);
console.log('appPrivateKey', appPrivateKey);


const transactionData = {
    "terminal_name": "yaazorutok",
    "expire_month": 11,
    "expire_year": 2030,
    //  "cvv": 111,
    "card_number": 'R0f2d9293fa45173087',
    "items": [
        {
            "name": "Pen",
            "type": "I",
            "unit_price": 2.00,
            "units_number": 1,
        }
    ]
}

const axiosInstance = axios.create({
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
});
const charge = async () => {
    console.log('charge');
    const { headers } = generateAccessToken(appPublicKey, appPrivateKey);
    console.log('charge after headrrs');
    console.log({ headers });

    try {
        await axiosInstance.post('https://api.tranzila.com/v1/transaction/credit_card/create', transactionData, { headers })
            .then(response => {
                console.log('i innnnnc 1111111111111');
                // console.log(response);

                console.log('Response:', response.data);
                return response;
            })
            .catch(error => {
                console.log('i innnnnc 222222222222');
                // console.log(error);
                console.error('Error:', error);
                return error;
            });
    } catch (err) {
        console.log('i in errorr');

    }

    // try {
    //     await axiosInstance.post('https://api.tranzila.com/v1/transactions', {
    //         "terminal_name": "yaazorutok",
    //     }, { headers })
    //         .then(response => {
    //             console.log('i innnnnc 1111111111111');
    //             console.log(response);

    //             console.log('Response:', response.data);
    //             return response;
    //         })
    //         .catch(error => {
    //             console.log('i innnnnc 222222222222');
    //             console.log(error);
    //             console.error('Error:', error);
    //             return error;
    //         });
    // } catch (err) {
    //     console.log('i in errorr');

    // }

}
export { charge }


    