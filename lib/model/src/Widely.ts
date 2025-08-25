import { WidelyApiData } from './ExternalApiTypes'

interface Model {
  status: string
  error_code: number
  message: string
  data: WidelyApiData[]
}

export { Model }
