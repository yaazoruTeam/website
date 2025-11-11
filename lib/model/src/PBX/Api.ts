/**
 * PBX API Request/Response Types
 * 
 * This module contains TypeScript interfaces for API communication
 */

import { CallDirection } from './Call'

export interface RouteRequest {
  did: string
  cid: string
  customerId?: number
  variables?: Record<string, string>
}

export interface RouteResponse {
  success: boolean
  data?: {
    destination: string
    outgoingCid: string
    provider: string
    rulePriority: number
    promptForDestination: boolean
  }
  error?: {
    code: string
    message: string
  }
}

export interface OriginateRequest {
  callerNumber: string
  calledNumber?: string
  destinationNumber: string
  direction: CallDirection
  timeout?: number
  variables?: Record<string, string>
  earlyMedia?: boolean
}

export interface OriginateResponse {
  success: boolean
  data?: {
    callId: string
    sessionId?: string
    status: string
  }
  error?: {
    code: string
    message: string
  }
}

export interface DIDValidationRequest {
  did: string
  callerNumber?: string
  format?: 'quick' | 'detailed'
}

export interface DIDValidationResponse {
  success: boolean
  data?: {
    valid: boolean
    message: string
    virtualNumber?: {
      number: string
      countryCode: string
      monthlyCost: number
    }
  }
  error?: {
    code: string
    message: string
  }
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PBXServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: Date
}
