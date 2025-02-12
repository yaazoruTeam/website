// import * as crypto from 'crypto';
import * as  CryptoJS from "crypto-js";


function generateAccessToken(appPublicKey: string, appPrivateKey: string): { headers: { [key: string]: string }, time: number, nonce: string } {
  // 1. חישוב הזמן הנוכחי ב-Unix format (שניות מאז 1970)
  const time = Math.round((new Date()).getTime() / 1000);//Math.floor(Date.now() / 1000);

  // 2. יצירת NONCE (מיתר אקראי באורך 80 תו)
  const nonce = makeid(80);

  // 3. חישוב ה-Access Token על ידי HMAC SHA256
  const hash = CryptoJS.HmacSHA256(appPublicKey, appPrivateKey + time + nonce).toString(CryptoJS.enc.Hex);
  //crypto.createHmac('sha256', appPrivateKey)
                     //.update(appPublicKey + time + nonce)
                     //.digest('hex');

  // 4. יצירת ה-Headers שצריך לשלוח בבקשה
  
  const headers = {
    'X-tranzila-api-app-key': appPublicKey,
    'X-tranzila-api-request-time': time.toString(),
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': hash
  };
console.log('heder',headers);

  return { headers, time, nonce };
}

// פונקציה ליצירת NONCE אקראי באורך 80 תו
function makeid(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default generateAccessToken;
