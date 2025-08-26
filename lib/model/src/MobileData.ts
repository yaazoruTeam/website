interface Model {
  endpoint_id: string | number
  domain_user_id?: string | number
  [key: string]: unknown
}

export { Model }