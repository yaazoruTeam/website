/**
 * PBX Client - Advanced client for PBX operations
 * 
 * This service provides advanced client-side functionality for PBX communication,
 * including event management, polling, caching, and real-time updates.
 */

import {
  PBXStatus,
  PBXServiceResponse
} from '@model'
import * as PBXApi from '../api/pbxApi'
import { PBX_CONSTANTS } from '../utils/pbxUtils'

// ===============================
// Types and Interfaces
// ===============================

export interface PBXClientConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  enablePolling: boolean
  pollingIntervals: {
    status: number
  }
}

export type APIResponse<T = unknown> = PBXServiceResponse<T>

export interface PBXClientEvents {
  'status_update': (status: PBXStatus) => void
  'status_error': (error: unknown) => void
  'connection_lost': () => void
  'connection_restored': () => void
}

// ===============================
// PBX Client Class
// ===============================

export class PBXClient {
  private config: PBXClientConfig
  private eventListeners: Map<keyof PBXClientEvents, ((data?: unknown) => void)[]> = new Map()
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map()
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map()
  private isConnected: boolean = false

  constructor(config?: Partial<PBXClientConfig>) {
    this.config = {
      baseURL: config?.baseURL || import.meta.env.VITE_BASE_URL || 'http://localhost:3006/controller',
      timeout: config?.timeout || PBX_CONSTANTS.DEFAULT_TIMEOUT,
      retryAttempts: config?.retryAttempts || PBX_CONSTANTS.DEFAULT_RETRY_ATTEMPTS,
      enablePolling: config?.enablePolling ?? true,
      pollingIntervals: {
        status: config?.pollingIntervals?.status || PBX_CONSTANTS.POLLING_INTERVALS.STATUS
      }
    }
  }

  // ===============================
  // Core Methods
  // ===============================

  /**
   * Initialize the PBX client and start polling if enabled
   */
  async initialize(): Promise<void> {
    try {
      const status = await PBXApi.initialize()
      if (status.success) {
        this.isConnected = true
        this.emit('status_update', status.data)
        
        if (this.config.enablePolling) {
          this.startAllPolling()
        }
      }
    } catch (error) {
      this.handleConnectionError(error)
    }
  }

  /**
   * Cleanup resources and stop all polling
   */
  cleanup(): void {
    this.stopAllPolling()
    this.eventListeners.clear()
    this.cache.clear()
  }

  // ===============================
  // Event Management
  // ===============================

  /**
   * Add event listener
   */
  on<K extends keyof PBXClientEvents>(event: K, callback: PBXClientEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback as (data?: unknown) => void)
  }

  /**
   * Remove event listener
   */
  off<K extends keyof PBXClientEvents>(event: K, callback?: PBXClientEvents[K]): void {
    if (!callback) {
      this.eventListeners.delete(event)
    } else {
      const listeners = this.eventListeners.get(event)
      if (listeners) {
        const index = listeners.indexOf(callback as (data?: unknown) => void)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit<K extends keyof PBXClientEvents>(event: K, data?: Parameters<PBXClientEvents[K]>[0]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  // ===============================
  // Polling Management
  // ===============================

  /**
   * Start all polling operations
   */
  private startAllPolling(): void {
    this.startStatusPolling()
  }

  /**
   * Stop all polling operations
   */
  private stopAllPolling(): void {
    this.pollingIntervals.forEach(interval => clearInterval(interval))
    this.pollingIntervals.clear()
  }

  /**
   * Start status polling
   */
  private startStatusPolling(): void {
    const intervalId = setInterval(async () => {
      try {
        const status = await PBXApi.healthCheck()
        if (status.success) {
          this.emit('status_update', status.data)
        } else {
          this.emit('status_error', { code: 'STATUS_ERROR', message: 'Failed to get status' })
        }
      } catch {
        this.emit('status_error', { code: 'POLLING_ERROR', message: 'Status polling failed' })
      }
    }, this.config.pollingIntervals.status)

    this.pollingIntervals.set('status', intervalId)
  }



  // ===============================
  // Error Handling
  // ===============================

  /**
   * Handle connection errors
   */
  private handleConnectionError(error: unknown): void {
    console.error('PBX connection error:', error)
    
    if (this.isConnected) {
      this.isConnected = false
      this.emit('connection_lost')
    }
  }

  // ===============================
  // Getters
  // ===============================

  /**
   * Get connection status
   */
  get connected(): boolean {
    return this.isConnected
  }

  /**
   * Get configuration
   */
  get configuration(): Readonly<PBXClientConfig> {
    return { ...this.config }
  }
}

// ===============================
// Default Instance Export
// ===============================

// Create default instance
export const pbxClient = new PBXClient()

// Export API functions for direct use
export * from '../api/pbxApi'

// Export utilities
export * from '../utils/pbxUtils'
