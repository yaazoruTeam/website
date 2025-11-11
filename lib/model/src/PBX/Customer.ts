/**
 * PBX Customer Types
 * 
 * Customer-related types for PBX integration
 */

export interface PBXCustomer {
  id: number
  name: string
  phone: string
  email?: string
  did?: string
  allowedNumbers?: string[]
  restrictions?: {
    canMakeOutbound: boolean
    canReceiveInbound: boolean
    maxCallDuration?: number
    allowedDestinations?: string[]
    blockedDestinations?: string[]
  }
  billing?: {
    plan: string
    ratePerMinute: number
    creditLimit?: number
    currentCredit?: number
  }
}

export interface CustomerCallRule {
  customerId: number
  priority: number
  condition: {
    callerNumber?: string
    calledNumber?: string
    timeRange?: {
      start: string // HH:MM format
      end: string   // HH:MM format
    }
    weekdays?: number[] // 0-6, Sunday=0
  }
  action: {
    type: 'route' | 'reject' | 'forward' | 'voicemail'
    destination?: string
    message?: string
  }
  active: boolean
}

export interface CustomerDID {
  customerId: number
  did: string
  description?: string
  active: boolean
  routing: {
    destination: string
    failoverDestination?: string
  }
}

export interface CustomerCallPermissions {
  customerId: number
  canMakeLocalCalls: boolean
  canMakeLongDistanceCalls: boolean
  canMakeInternationalCalls: boolean
  allowedPrefixes?: string[]
  blockedPrefixes?: string[]
  maxConcurrentCalls?: number
}