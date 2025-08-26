import { WidelySearchResult, WidelyMobileResult, WidelyMobileInfoResult } from './WidelyApiTypes'

interface Model {
  status: string
  error_code: number
  message: string
  data: WidelySearchResult[] | WidelyMobileResult[] | WidelyMobileInfoResult[]
}

export { Model }
