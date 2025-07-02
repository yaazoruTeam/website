import crypto from 'crypto'

// הסר את dotenv כי המשתנים מוגדרים ב-docker-compose.yaml
console.log('Environment variables from docker-compose:')
console.log('BRAND_TOKEN:', process.env.BRAND_TOKEN)
console.log('BRAND_ID:', process.env.BRAND_ID)
console.log('ACCOUNT_TOKEN:', process.env.ACCOUNT_TOKEN)
console.log('AUTH_ID:', process.env.AUTH_ID)

// קריאת משתני סביבה
const {
  BRAND_TOKEN = '',
  BRAND_ID = '0',
  ACCOUNT_TOKEN = '',
  AUTH_ID = '0'
} = process.env

// המרה לסוגים הנכונים
const brandId = parseInt(BRAND_ID, 10)
const authId = parseInt(AUTH_ID, 10)

// בדיקת משתנים נדרשים
if (!BRAND_TOKEN || !brandId || !ACCOUNT_TOKEN || !authId) {
  console.warn('Warning: Missing required environment variables in .env file. Please configure BRAND_TOKEN, BRAND_ID, ACCOUNT_TOKEN, and AUTH_ID.')
}

// יצירת hash אקראי
const generateHash = (): string =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 15)}`

// חישוב MD5
const calculateMD5 = (input: string): string =>
  crypto.createHash('md5').update(input).digest('hex')

// יצירת אובייקט auth מלא
const createAuth = (): {
  auth_id: number
  hash: string
  auth: string
} => {
  const hash = generateHash()
  const innerAuth = calculateMD5(BRAND_TOKEN + hash)
  const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)
  console.log(`Brand ID: ${brandId}, Auth ID: ${authId}, Hash: ${hash}, Final Auth: ${finalAuth}`);
  

  return {
    auth_id: authId,
    hash,
    auth: finalAuth
  }
}

export {
  createAuth
}