import crypto from 'crypto'
import { config } from '@/config'

// שימוש במשתנים מה-config המרכזי
const { brandToken: BRAND_TOKEN, brandId, accountToken: ACCOUNT_TOKEN, authId } = config.widely

// יצירת hash אקראי
const generateHash = (): string => `${Date.now()}_${Math.random().toString(36).slice(2, 15)}`

// חישוב MD5
const calculateMD5 = (input: string): string => crypto.createHash('md5').update(input).digest('hex')

// יצירת אובייקט auth מלא
const createAuth = (): {
  auth_id: number
  hash: string
  auth: string
} => {
  const hash = generateHash()
  const innerAuth = calculateMD5(BRAND_TOKEN + hash)
  const finalAuth = calculateMD5(ACCOUNT_TOKEN + innerAuth)

  return {
    auth_id: authId,
    hash,
    auth: finalAuth,
  }
}

export { createAuth }
