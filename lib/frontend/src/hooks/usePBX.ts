/**
 * usePBX - React Hook for PBX Integration
 * 
 * This custom React hook provides a comprehensive interface for managing
 * PBX functionality including calls, status monitoring, and event handling.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { pbxClient, PBXClient } from '../services/pbxClient'
import * as PBXApi from '../api/pbxApi'
import * as PBXUtils from '../utils/pbxUtils'
import {
  RouteRequest,
  RouteResponse,
  PBXStatus,
  CallLogEntry,
  CallLogFilter,
  DIDValidationRequest,
  DIDValidationResponse
} from '@model'

// ===============================
// Hook Types and Interfaces
// ===============================

export interface UsePBXOptions {
  autoConnect?: boolean
  statusPollingInterval?: number
  onStatusUpdate?: (status: PBXStatus) => void
  onError?: (error: unknown) => void
}

export interface PBXHookState {
  // Connection Status
  isConnected: boolean
  isInitializing: boolean
  connectionError: string | null

  // PBX Status
  pbxStatus: PBXStatus | null
  lastStatusUpdate: Date | null

  // Operation States
  isRouting: boolean
  isOriginating: boolean
  isValidating: boolean
  isLoadingLogs: boolean

  // Errors
  routingError: string | null
  originatingError: string | null
  validationError: string | null
  logsError: string | null
}

export interface PBXHookActions {
  // Connection Management
  connect: () => Promise<boolean>
  disconnect: () => void
  reconnect: () => Promise<boolean>
  
  // Call Management
  routeCall: (request: RouteRequest) => Promise<RouteResponse | null>
  
  // Information
  validateDID: (request: DIDValidationRequest) => Promise<DIDValidationResponse | null>
  getCallLogs: (filter?: CallLogFilter) => Promise<CallLogEntry[] | null>
  refreshStatus: () => Promise<void>
  
  // Utilities
  formatPhoneNumber: (number: string) => string
  formatDuration: (seconds: number) => string
  getCallStateColor: (state: string) => string
}

// ===============================
// Main usePBX Hook
// ===============================

export const usePBX = (options: UsePBXOptions = {}): [PBXHookState, PBXHookActions] => {
  const {
    autoConnect = false,
    statusPollingInterval = 30000,
    onError
  } = options

  // ===============================
  // State Management
  // ===============================

  const [state, setState] = useState<PBXHookState>({
    isConnected: false,
    isInitializing: false,
    connectionError: null,
    pbxStatus: null,
    lastStatusUpdate: null,
    isRouting: false,
    isOriginating: false,
    isValidating: false,
    isLoadingLogs: false,
    routingError: null,
    originatingError: null,
    validationError: null,
    logsError: null
  })

  // ===============================
  // Refs and Cleanup
  // ===============================

  const statusPollingCleanupRef = useRef<(() => void) | null>(null)
  const clientRef = useRef<PBXClient>(pbxClient)

  // ===============================
  // Utility Functions
  // ===============================

  const updateState = useCallback((updates: Partial<PBXHookState>) => {
    setState(prevState => ({ ...prevState, ...updates }))
  }, [])

  const handleError = useCallback((error: unknown, errorType: keyof PBXHookState) => {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message: string }).message 
      : typeof error === 'string' 
        ? error 
        : 'Unknown error'
    updateState({ [errorType]: errorMessage })
    onError?.(error)
    console.error(`PBX ${errorType}:`, error)
  }, [updateState, onError])

  // ===============================
  // Connection Management
  // ===============================

  const connect = useCallback(async (): Promise<boolean> => {
    updateState({ isInitializing: true, connectionError: null })
    
    try {
      // First check health
      const healthResult = await PBXApi.healthCheck()
      
      if (!healthResult.success) {
        // Try to initialize if health check fails
        const initResult = await PBXApi.initialize()
        
        if (!initResult.success) {
          throw new Error('Failed to initialize PBX')
        }
        
        updateState({
          isConnected: true,
          isInitializing: false,
          pbxStatus: initResult.data || null,
          lastStatusUpdate: new Date()
        })
      } else {
        updateState({
          isConnected: true,
          isInitializing: false,
          pbxStatus: healthResult.data || null,
          lastStatusUpdate: new Date()
        })
      }

      // Start polling if connected
      startPolling()
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      updateState({
        isConnected: false,
        isInitializing: false,
        connectionError: errorMessage
      })
      handleError(error, 'connectionError')
      return false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState, handleError])

  const disconnect = useCallback(() => {
    stopPolling()
    updateState({
      isConnected: false,
      pbxStatus: null,
      connectionError: null
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState])

  const reconnect = useCallback(async (): Promise<boolean> => {
    disconnect()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Brief delay
    return connect()
  }, [disconnect, connect])

  // ===============================
  // Polling Management
  // ===============================

  const startPolling = useCallback(() => {
    // Status polling
    if (statusPollingInterval > 0) {
      const statusInterval = setInterval(async () => {
        try {
          const result = await PBXApi.healthCheck()
          
          if (result.success) {
            updateState({
              pbxStatus: result.data || null,
              lastStatusUpdate: new Date(),
              isConnected: result.data ? true : false
            })
          }
        } catch (error) {
          console.warn('Failed to refresh status:', error)
        }
      }, statusPollingInterval)
      
      statusPollingCleanupRef.current = () => {
        clearInterval(statusInterval)
      }
    }
  }, [statusPollingInterval, updateState])

  const stopPolling = useCallback(() => {
    if (statusPollingCleanupRef.current) {
      statusPollingCleanupRef.current()
      statusPollingCleanupRef.current = null
    }

    // Remove all event listeners
    clientRef.current.off('status_update')
    clientRef.current.off('status_error')
  }, [])

  // ===============================
  // Call Management Actions
  // ===============================

  const routeCall = useCallback(async (request: RouteRequest): Promise<RouteResponse | null> => {
    updateState({ isRouting: true, routingError: null })
    
    try {
      const result = await PBXApi.routeCall(request)
      
      updateState({ isRouting: false })
      return result
    } catch (error) {
      updateState({ isRouting: false })
      handleError(error, 'routingError')
      return null
    }
  }, [updateState, handleError])

  // ===============================
  // Information Actions
  // ===============================

  const validateDID = useCallback(async (request: DIDValidationRequest): Promise<DIDValidationResponse | null> => {
    updateState({ isValidating: true, validationError: null })
    
    try {
      const result = await PBXApi.validateDID(request)
      updateState({ isValidating: false })
      return result
    } catch (error) {
      updateState({ isValidating: false })
      handleError(error, 'validationError')
      return null
    }
  }, [updateState, handleError])

  const getCallLogs = useCallback(async (filter?: CallLogFilter): Promise<CallLogEntry[] | null> => {
    updateState({ isLoadingLogs: true, logsError: null })
    
    try {
      const result = await PBXApi.getCallLogs(filter)
      updateState({ isLoadingLogs: false })
      
      if (result.success) {
        return result.data || []
      } else {
        handleError('Failed to get call logs', 'logsError')
        return null
      }
    } catch (error) {
      updateState({ isLoadingLogs: false })
      handleError(error, 'logsError')
      return null
    }
  }, [updateState, handleError])

  const refreshStatus = useCallback(async (): Promise<void> => {
    try {
      const result = await PBXApi.healthCheck()
      
      if (result.success) {
        updateState({
          pbxStatus: result.data || null,
          lastStatusUpdate: new Date(),
          isConnected: result.data ? true : false
        })
      }
    } catch (error) {
      console.warn('Failed to refresh status:', error)
    }
  }, [updateState])

  // ===============================
  // Utility Actions
  // ===============================

  const formatPhoneNumber = useCallback((number: string): string => {
    return PBXUtils.formatPhoneNumber(number)
  }, [])

  const formatDuration = useCallback((seconds: number): string => {
    return PBXUtils.formatDuration(seconds)
  }, [])

  const getCallStateColor = useCallback((state: string): string => {
    return PBXUtils.getCallStateColor(state)
  }, [])

  // ===============================
  // Effects
  // ===============================

  // Auto-connect on mount
  useEffect(() => {
    const currentClient = clientRef.current
    
    if (autoConnect) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      stopPolling()
      if (currentClient) {
        currentClient.cleanup()
      }
    }
  }, [autoConnect, connect, stopPolling])

  // ===============================
  // Return Hook Interface
  // ===============================

  const actions: PBXHookActions = {
    connect,
    disconnect,
    reconnect,
    routeCall,
    validateDID,
    getCallLogs,
    refreshStatus,
    formatPhoneNumber,
    formatDuration,
    getCallStateColor
  }

  return [state, actions]
}

// ===============================
// Specialized Hooks
// ===============================

/**
 * Hook specifically for call routing
 */
export const usePBXRouting = () => {
  const [{ isRouting, routingError }, { routeCall, validateDID }] = usePBX({ autoConnect: true })
  
  return {
    isRouting,
    routingError,
    routeCall,
    validateDID
  }
}