/**
 * Call Log Types for PBX Integration
 * 
 * This module contains TypeScript interfaces for call logging and filtering
 */

import { CallDirection } from './Call'

export interface CallLog {
  id: string
  callId: string
  sessionId?: string
  callerNumber: string
  calledNumber: string
  direction: CallDirection
  startTime: Date
  endTime?: Date
  duration?: number
  status: 'ringing' | 'answered' | 'hangup' | 'failed' | 'busy' | 'no_answer'
  hangupCause?: string
  customerId?: number
  variables?: Record<string, string>
  recordingPath?: string
  cost?: number
  provider?: string
}

// Alias for backward compatibility
export type CallLogEntry = CallLog

export interface CallLogFilter {
  startDate?: Date
  endDate?: Date
  callerNumber?: string
  calledNumber?: string
  direction?: CallDirection
  status?: CallLog['status']
  customerId?: number
  limit?: number
  offset?: number
  sortBy?: 'startTime' | 'duration' | 'cost'
  sortOrder?: 'asc' | 'desc'
}

export interface CallLogResponse {
  logs: CallLog[]
  total: number
  hasMore: boolean
  filter: CallLogFilter
}

export interface CallLogStats {
  totalCalls: number
  totalDuration: number
  totalCost?: number
  answeredCalls: number
  failedCalls: number
  averageDuration: number
  period: {
    start: Date
    end: Date
  }
}