import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const BRAND_TOKEN: string = process.env.BRAND_TOKEN || ''
const BRAND_ID: number = parseInt(process.env.BRAND_ID || '0', 10)

const generateHash = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

const calculateMD5 = (input: string): string => {
  return crypto.createHash('md5').update(input).digest('hex')
}

interface Auth {
  auth_id: number
  hash: string
  auth: string
}

export { BRAND_TOKEN, BRAND_ID, generateHash, calculateMD5, Auth }
