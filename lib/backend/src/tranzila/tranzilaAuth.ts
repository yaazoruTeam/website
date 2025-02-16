import * as  CryptoJS from "crypto-js";


const generateAccessTokenTranzila = (appPublicKey: string, appPrivateKey: string): { headers: { [key: string]: string }, time: number, nonce: string } => {
  const time = Math.round((new Date()).getTime() / 1000);
  const nonce = makeid(80);
  const hash = CryptoJS.HmacSHA256(appPublicKey, appPrivateKey + time + nonce).toString(CryptoJS.enc.Hex);
  const headers = {
    'X-tranzila-api-app-key': appPublicKey,
    'X-tranzila-api-request-time': time.toString(),
    'X-tranzila-api-nonce': nonce,
    'X-tranzila-api-access-token': hash
  };
  return { headers, time, nonce };
}

const makeid = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default generateAccessTokenTranzila;
