interface Model {
  status: string
  error_code: number
  message: string
  data: Record<string, unknown>[] | Record<string, unknown> | null
}

export { Model }
