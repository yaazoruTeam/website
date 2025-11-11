/**
 * PBX Status and Health Types
 * 
 * This module contains TypeScript interfaces for PBX system status and health monitoring
 */

export interface PBXHealthStatus {
  healthy: boolean
  uptime: number
  version?: string
  activeChannels?: number
  activeCalls?: number
  lastCheck: Date
}

export interface PBXStatus extends PBXHealthStatus {
  connected: boolean
  lastHeartbeat: Date
  totalCalls?: number
}

export interface PBXStatusResponse {
  success: boolean
  data?: PBXHealthStatus
  error?: {
    code: string
    message: string
  }
}

export interface SystemStatusUpdate {
  status: PBXHealthStatus
  timestamp: Date
}