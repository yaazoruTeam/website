// Temporary switchboard types - will be replaced when server models are ready
// to do: טיפוס זמני לשנות לטיפוס הנכון כשהשרת יהיה מוכן

export type CountryCode = 'USA' | 'Israel' | 'England'

export interface SwitchboardAccount {
  ID: number
  customerName: string
  email: string
  notes: string
  balanceForUse: number
}

export interface SwitchboardCall {
  organizationName: string
  number: string
  country: CountryCode
  target: string
  fromDate: Date
  definedAsAnIdentifier: boolean
  monthlyCost: number
  outgoingCalls: boolean
}

export interface CallLogEntry {
  country: string
  target: string
  date: number
  durationCall: string
  timeCall: string
  costInShekels: string
  penniesPerMinute: string
}

export interface NumberPlan {
  number: string
  price: string
}

export interface EditNumberFormData {
  target: string
  notes: string
  notifyEmailOfAllCalls: string
  toReceiveSMSToEmail: string
}

export interface PurchasingNumberFormData {
  personalID: string
  target: string
  notes: string
  SMSToEmail: string
  notifyEmailCalls: string
}

// Event handler types
export interface SwitchEventHandler {
  (checked: boolean): void
}

export interface CallActionHandler {
  (call: SwitchboardCall): void
}

export interface RowActionHandler {
  (row: SwitchboardAccount): void
}
