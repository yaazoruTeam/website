import { Customer, Device, HttpError } from "."

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  LOCKED_IMEI = 'lock_in_imei'
}

interface Model {
  simCard_id: number,
  simNumber: string,
  customer_id?: number,
  customer?: Customer.Model,
  device_id?: number,
  device?: Device.Model,
  receivedAt?: Date, // Set only when linking device to customer
  planEndDate?: Date,
  plan: string | null,
  created_at: Date,
  updated_at: Date,
  status?: DeviceStatus,
}

function sanitize(simCard: Partial<Model>, hasId: boolean): Partial<Model> {
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

  const newSimCard: Partial<Model> = {
    simCard_id: simCard.simCard_id,
    simNumber: simCard.simNumber,
    customer_id: simCard.customer_id,
    device_id: simCard.device_id,
    receivedAt: simCard.receivedAt,
    planEndDate: simCard.planEndDate,
    plan: simCard.plan,
    status: simCard.status,
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

