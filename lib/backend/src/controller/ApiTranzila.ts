import axios from 'axios';  // התקנה: npm install axios
import * as CryptoJS from 'crypto-js';  // התקנה: npm install crypto-js

// פונקציה ליצירת nonce אקראי
function makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// זמן נוכחי ב- Unix timestamp (שניות מאז 1 בינואר 1970)
const time = Math.round((new Date()).getTime() / 1000);

// יצירת nonce אקראי באורך 80
const nonce = makeid(80);

// המפתחות שלך


const key = '';  // המפתח הציבורי שלך
const privateKey = '';  // המפתח הסודי שלך

// יצירת ה-hash עבור ה-access-token
const hash = CryptoJS.HmacSHA256(key + privateKey + time + nonce, privateKey).toString(CryptoJS.enc.Hex);

// הכנת כותרות הבקשה
const headers = {
    'X-tranzila-api-app-key': key,
    'X-tranzila-api-request-time': time.toString(),
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': hash
};

// הנתונים של הבקשה (הכנס את הנתונים שאתה צריך)
const data = {
    terminal_name: "yaazoru",
    expire_month: 12,
    expire_year: 2030,
    // cvv: null,
    // card_holder_id: 25641832,
    card_number: "ieff4b4e3bae1df4580",
    response_language: "hebrew",
};

// שליחת הבקשה עם Axios
axios.post('https://api.tranzila.com/v1/transaction/credit_card/create', data, { headers })
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
