import { CreditDetails } from '@model'
import { 
  apiPost,
  // apiGet,
  safeApiGet 
} from './core/apiHelpers'

const ENDPOINT = '/creditDetails'

export const createCreditDetails = async (
  creditDetails: CreditDetails.Model,
): Promise<CreditDetails.Model> => {
  return apiPost<CreditDetails.Model>(ENDPOINT, creditDetails)
}

export const getCreditDetailsById = async (
  creditDetails_id: string,
): Promise<CreditDetails.Model> => {
  return safeApiGet<CreditDetails.Model>(
    `${ENDPOINT}/${creditDetails_id}`,
    {} as CreditDetails.Model
  )
}
