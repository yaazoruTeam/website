import { PaymentCreditLink } from '@model'
import { 
  // apiGet,
  safeApiGet 
} from './core/apiHelpers'

const ENDPOINT = '/paymentCreditLink'

export const getPaymentCreditLinkByMonthlyPaymentId = async (
  monthlyPayment_id: string,
): Promise<PaymentCreditLink.Model> => {
  return safeApiGet<PaymentCreditLink.Model>(
    `${ENDPOINT}/monthlyPayment/${monthlyPayment_id}`,
    {} as PaymentCreditLink.Model
  )
}
