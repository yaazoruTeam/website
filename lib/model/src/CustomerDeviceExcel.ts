import { Customer, Device, HttpError } from '.'

interface Model {
  customer?: Customer.Model
  device: Device.Model
  receivedAt: Date | string | number
}

const sanitize = (customerDeviceExcel: Model, isCustomer: boolean): Model => {
  const parseDate = (date: number | string): Date => {
    if (typeof date === 'number') {
      const excelEpoch = new Date(1900, 0, 1)
      return new Date(excelEpoch.getTime() + (date - 2) * 24 * 60 * 60 * 1000)
    }
    if (typeof date === 'string') {
      // תאריך בפורמט dd/mm/yyyy
      const dateParts = date.split('/')
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10)
        const month = parseInt(dateParts[1], 10) - 1
        const year = parseInt(dateParts[2], 10)
        const parsedDate = new Date(year, month, day)
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate
        }
      }
    }
    throw new Error(`Invalid date format: ${date}`)
  }

  try {
    if (isCustomer) {
      customerDeviceExcel.receivedAt =
        customerDeviceExcel.receivedAt instanceof Date
          ? customerDeviceExcel.receivedAt
          : parseDate(customerDeviceExcel.receivedAt)
      if (!customerDeviceExcel.customer) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Customer is undefined in the input object.',
        }
        throw error
      }
      return {
        ...customerDeviceExcel,
        customer: Customer.sanitize(customerDeviceExcel.customer, false),
        device: Device.sanitize(customerDeviceExcel.device, false),
      }
    } else {
      return {
        ...customerDeviceExcel,
        customer: undefined,
        device: Device.sanitize(customerDeviceExcel.device, false),
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Sanitize failed:', errorMessage)
    throw error
  }
}

export { Model, sanitize }
