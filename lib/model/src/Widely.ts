import { WidelySearchResult, WidelyMobileResult, WidelyMobileInfoResult } from './WidelyApiTypes'

interface SearchUsersModel {
  status: string
  error_code: number
  message: string
  data: WidelySearchResult[]
}

interface GetMobilesModel {
  status: string
  error_code: number
  message: string
  data: WidelyMobileResult[]
}

interface GetMobileInfoModel {
  status: string
  error_code: number
  message: string
  data: WidelyMobileInfoResult[]
}

// Generic model for backwards compatibility
interface Model {
  status: string
  error_code: number
  message: string
  data: WidelySearchResult[] | WidelyMobileResult[] | WidelyMobileInfoResult[]
}

export { Model, SearchUsersModel, GetMobilesModel, GetMobileInfoModel }
