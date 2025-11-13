/**
 * Call Basic Types
 * 
 * This module contains basic call types needed for NodeRouting integration
 */

export type CallState = 'idle' | 'ringing' | 'answered' | 'held' | 'hangup'
export type CallDirection = 'inbound' | 'outbound'