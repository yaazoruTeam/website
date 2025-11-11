/**
 * Call Session Types
 * 
 * This module contains TypeScript interfaces and types for call sessions and states
 */

export type CallState = 'idle' | 'ringing' | 'answered' | 'held' | 'hangup'
export type CallDirection = 'inbound' | 'outbound'

export interface CallSession {
  callId: string
  sessionId?: string
  callerNumber: string
  calledNumber: string
  direction: CallDirection
  state: CallState
  startTime: Date
  answerTime?: Date
  endTime?: Date
  duration?: number
  metadata?: Record<string, any>
}

export interface CallStatusUpdate {
  callId: string
  state: CallState
  timestamp: Date
}

export interface HangupRequest {
  callId: string
  sessionId?: string
  cause?: string
}

export interface TransferRequest {
  callId: string
  destination: string
  transferType?: 'blind' | 'attended'
  type?: 'blind' | 'attended'
}