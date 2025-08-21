interface Model<T = unknown> {
  status: string
  error_code: number
  message: string
  data: T[]
}

export { Model }
