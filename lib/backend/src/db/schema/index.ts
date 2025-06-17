import { createYaazoruSchema } from './yaazoru'
import { createCustomerSchema } from './customer'
import { createDeviceSchema } from './device'
import { createCustomerDeviceSchema } from './customerDevice'
import { createUserSchema } from './user'
import { createBranchSchema } from './branch'
import { createBranchCustomerSchema } from './branchCustomer'
import { createBranchUserSchema } from './branchUser'
import { createCreditDetailsSchema } from './creditDetails'
import { createTransactionDetailsSchema } from './transactionDetails'
import { createMonthlyPayment } from './monthlyPayment'
import { createPayments } from './payments'
import { createItem } from './itemForMonthlyPayment'
import { createPaymentCreditLink } from './paymentCreditLink'
import { createCommentsSchema } from './comments'

const createSchema = async () => {
  console.log('Creating schema...')
  try {
    await createYaazoruSchema()
    await createCustomerSchema()
    await createDeviceSchema()
    await createCustomerDeviceSchema()
    await createUserSchema()
    await createBranchSchema()
    await createBranchCustomerSchema()
    await createBranchUserSchema()
    await createCreditDetailsSchema()
    await createTransactionDetailsSchema()
    await createMonthlyPayment()
    await createPayments()
    await createItem()
    await createPaymentCreditLink()
    await createCommentsSchema()
    console.log('Schema created successfully')
  } catch (err) {
    console.error('Error creating schema', err)
  }
}

export { createSchema }
