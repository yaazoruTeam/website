import { HttpError } from "."

interface Model {
    simCard_id: string
    simNumber: string
    user_id: number
    device_id: number
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
  if (!simCard.user_id) {    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "user_id".',
    }
    throw error
  }
  if (!simCard.device_id) {    
    const error: HttpError.Model = {
      status: 400,
      message: 'Invalid or missing "device_id".',
    }
    throw error
  }
  const newSimCard: Model = {
    ...simCard,
    receivedAt: simCard.receivedAt || new Date(Date.now()),
    planEndDate: simCard.planEndDate, //to do: send to function that adds 5 years from receivedAt
  }

  return newSimCard
}

const sanitizeExistingSimCard = (simCardExis: Model, simCard: Model) => {
  if (simCardExis.simNumber === simCard.simNumber) {
    const error: HttpError.Model = {
      status: 409,
      message: 'simNumber already exists',
    }
    throw error
  }
  if (simCardExis.device_id === simCard.device_id) {
    const error: HttpError.Model = {
      status: 409,
      message: 'device_id already exists - each device can only have one SIM card',
    }
    throw error
  }
}

const sanitizeIdExisting = (req: any) => {
  if (!req.params.id) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No ID provided',
    }
    throw error
  }
}

const sanitizeBodyExisting = (req: any) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const error: HttpError.Model = {
      status: 400,
      message: 'No body provided',
    }
    throw error
  }
}

export type { Model }
export { sanitize, sanitizeExistingSimCard, sanitizeIdExisting, sanitizeBodyExisting }

