import { Customer } from ".";

interface Model {
    id: number,
    customerId: number,
    callerId: string,
    dialedNumber: string,
    outgoingCid: string,
    destination: string,
    duration: number,
    cost: number,
    callType: 'inbound' | 'outbound',
    provider: string,
    status: 'completed' | 'failed' | 'missed',
    startTime: Date,
    customer: Customer.Model,
}

export type { Model };