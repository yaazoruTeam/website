import { HttpError } from "."

interface Model {
    simCard_id: string
    simNumber: string
    customer_id: string
    device_id: string
    receivedAt: Date
    planEndDate?: Date
}

function sanitize(simCard: Model, hasId: boolean): Model {
  if (hasId && !simCard.simCard_id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "simCard_id".',
    }
    throw error
  }
  if (!simCard.simNumber) {    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "simNumber".',
    }
    throw error
  }
  const newDevice: Model = {
    ...simCard,
    receivedAt: simCard.receivedAt || new Date(Date.now()),
    planEndDate: simCard.planEndDate, //to do: send to function that adds 5 years from receivedAt
  }

  return newDevice
}

export type { Model }
export { sanitize }
