/**
 * PBX Service - FreeSWITCH Integration Layer
 * 
 * This service provides a comprehensive integration layer for FreeSWITCH PBX server
 * including call origination, routing, status monitoring, and event handling.
 */

import axios from 'axios'
import * as https from 'https'
import { EventEmitter } from 'events'
import config from '@config/index'
import logger from '@utils/logger'
import {
  // All PBX Types
  PBXConfig,
  CallState,
  CallDirection,
  RouteRequest,
  RouteResponse,
  DIDValidationRequest,
  DIDValidationResponse,
  CallLogEntry,
  CallLogFilter,
  PBXError,
  PBXErrorCode,
  PBXServiceResponse,
  PBXStatus,
  WebSocketEventMessage,
  SystemStatusUpdate,
  CreateRoutingRuleRequest,
  CreateRoutingRuleResponse,
  UpdateRoutingRuleRequest,
  UpdateRoutingRuleResponse,
  GetCustomerRulesResponse,
  DeleteRoutingRuleResponse
} from '@model'

/**
 * Main PBX Service Class
 * Handles all communication with FreeSWITCH server
 */
class PBXService extends EventEmitter {
  private pbxConfig: PBXConfig
  private wsConnection?: any // WebSocket connection (optional)
  private heartbeatInterval?: NodeJS.Timeout
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private isConnected = false
  private lastHeartbeat = new Date()
  private eventSubscriptions = new Map<string, Function>()

  constructor() {
    super()
    this.pbxConfig = this.loadPBXConfig()
    this.initializeEventHandlers()
  }

  /**
   * Load PBX configuration from environment
   */
  private loadPBXConfig(): PBXConfig {
    return {
      host: config.pbx.host,
      port: config.pbx.port,
      protocol: config.pbx.protocol || 'http',
      timeout: config.pbx.timeout,
      retryAttempts: config.pbx.retryAttempts,
      apiPath: config.pbx.apiPath
    }
  }

  /**
   * Build URL for PBX API endpoints
   */
  private buildUrl(endpoint: string): string {
    const apiPath = this.pbxConfig.apiPath || '/api/freeswitch'
    return `${this.pbxConfig.protocol}://${this.pbxConfig.host}:${this.pbxConfig.port}${apiPath}${endpoint}`
  }

  /**
   * Initialize the PBX service connection
   */
  async initialize(): Promise<PBXServiceResponse<PBXStatus>> {
    try {
      logger.info('Initializing PBX service connection...')
      
      // Test connection
      const healthCheck = await this.healthCheck()
      if (!healthCheck.success) {
        throw new PBXError('Failed to connect to PBX server', PBXErrorCode.CONNECTION_FAILED, healthCheck.error)
      }

      // Initialize WebSocket connection if enabled
      if (config.pbx.websocketEnabled) {
        await this.initializeWebSocket()
      }

      this.isConnected = true
      logger.info('PBX service initialized successfully')

      return {
        success: true,
        data: healthCheck.data,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to initialize PBX service:', error)
      return {
        success: false,
        error: {
          code: error instanceof PBXError ? error.code : PBXErrorCode.INTERNAL_ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof PBXError ? error.details : {}
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Initialize event handlers for internal processing
   */
  private initializeEventHandlers(): void {
    this.on('connection_lost', () => {
      this.isConnected = false
      this.attemptReconnection()
    })
  }

  /**
   * Check PBX server health and status
   */
  async healthCheck(): Promise<PBXServiceResponse<PBXStatus>> {
    try {
      const url = this.buildUrl('/health')
      
      const response = await axios.get(url, {
        timeout: this.pbxConfig.timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        }),
        headers: {
          'Host': 'localhost:8080',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'PBX-Client/1.0'
        }
        // Removed auth - testing if server requires it
        // auth: {
        //   username: this.pbxConfig.username,
        //   password: this.pbxConfig.password
        // }
      })

      const status: PBXStatus = {
        connected: true,
        healthy: true,
        version: response.data.version,
        uptime: response.data.uptime || 0,
        activeCalls: 0, // Not managed by NodeRouting
        totalCalls: response.data.total_calls || 0,
        lastHeartbeat: new Date(),
        lastCheck: new Date()
      }

      this.lastHeartbeat = new Date()
      
      return {
        success: true,
        data: status,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('PBX health check failed:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.CONNECTION_FAILED,
          message: 'Health check failed',
          details: { originalError: error }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Route a call through the PBX system
   * Maps to existing /route endpoint functionality
   */
  async routeCall(request: RouteRequest): Promise<PBXServiceResponse<RouteResponse>> {
    try {
      logger.info(`Routing call: DID=${request.did}, CID=${request.cid}`)
      
      const url = this.buildUrl('/route')
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.post(url, {
        did: request.did,
        cid: request.cid,
        variables: request.variables || {}
      }, requestConfig)

      const routeResponse: RouteResponse = {
        success: response.data.success || true,
        data: {
          destination: response.data.destination,
          outgoingCid: response.data.outgoing_cid,
          provider: response.data.provider,
          rulePriority: response.data.rulePriority || 1,
          promptForDestination: response.data.promptForDestination || false
        }
      }

      logger.info(`Route found: ${routeResponse.data?.destination}`)
      
      return {
        success: true,
        data: routeResponse,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Call routing failed:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.ROUTING_FAILED,
          message: 'Failed to route call',
          details: { 
            did: request.did, 
            cid: request.cid,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Validate DID number
   * Maps to existing /validate-did endpoint functionality
   */
  async validateDID(request: DIDValidationRequest): Promise<PBXServiceResponse<DIDValidationResponse>> {
    try {
      logger.info(`Validating DID: ${request.did}`)
      
      const endpoint = request.format === 'quick' ? '/validate-did/format' : '/validate-did'
      const url = this.buildUrl(endpoint)
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.post(url, {
        did: request.did
      }, requestConfig)

      const validationResponse: DIDValidationResponse = {
        success: true,
        data: {
          valid: response.data.valid || response.data.data?.valid || false,
          message: response.data.message || 'DID validation completed',
          virtualNumber: response.data.data?.virtual_number ? {
            number: response.data.data.virtual_number.number,
            countryCode: response.data.data.virtual_number.countryCode,
            monthlyCost: response.data.data.virtual_number.monthlyCost
          } : undefined
        }
      }

      return {
        success: true,
        data: validationResponse,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('DID validation failed:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INVALID_REQUEST,
          message: 'DID validation failed',
          details: { 
            did: request.did,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }







  /**
   * Get call logs
   * Maps to existing /call-log endpoint functionality
   */
  async getCallLogs(filter?: CallLogFilter): Promise<PBXServiceResponse<CallLogEntry[]>> {
    try {
      logger.info('Retrieving call logs')
      
      const url = this.buildUrl('/call-log')
      
      const queryParams = new URLSearchParams()
      if (filter?.startDate) queryParams.append('start_date', filter.startDate.toISOString())
      if (filter?.endDate) queryParams.append('end_date', filter.endDate.toISOString())
      if (filter?.callerNumber) queryParams.append('caller_number', filter.callerNumber)
      if (filter?.calledNumber) queryParams.append('called_number', filter.calledNumber)
      if (filter?.direction) queryParams.append('direction', filter.direction)
      if (filter?.limit) queryParams.append('limit', filter.limit.toString())
      if (filter?.offset) queryParams.append('offset', filter.offset.toString())

      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.get(`${url}?${queryParams.toString()}`, requestConfig)

      const callLogs: CallLogEntry[] = response.data.data?.map((log: any) => ({
        id: log.id,
        callId: log.call_id,
        direction: log.direction as CallDirection,
        callerNumber: log.caller_number,
        calledNumber: log.called_number,
        startTime: new Date(log.start_time),
        answerTime: log.answer_time ? new Date(log.answer_time) : undefined,
        endTime: log.end_time ? new Date(log.end_time) : undefined,
        duration: log.duration || 0,
        state: log.state as CallState,
        hangupCause: log.hangup_cause,
        cost: log.cost,
        customerId: log.customer_id,
        recordings: log.recordings || [],
        metadata: log.metadata || {}
      })) || []

      return {
        success: true,
        data: callLogs,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to retrieve call logs:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INTERNAL_ERROR,
          message: 'Failed to retrieve call logs',
          details: { originalError: error instanceof Error ? error.message : 'Unknown error' }
        },
        timestamp: new Date()
      }
    }
  }





  /**
   * Get current PBX status
   */
  getStatus(): PBXStatus {
    return {
      connected: this.isConnected,
      healthy: this.isConnected,
      uptime: 0, // This would be fetched from PBX
      activeCalls: 0, // Not managed by NodeRouting
      totalCalls: 0, // This would be fetched from PBX
      lastHeartbeat: this.lastHeartbeat,
      lastCheck: new Date()
    }
  }

  // ===============================
  // Routing Rule Management
  // ===============================

  /**
   * Create a new routing rule
   * POST /route/create
   */
  async createRoutingRule(request: CreateRoutingRuleRequest): Promise<PBXServiceResponse<CreateRoutingRuleResponse>> {
    try {
      logger.info(`Creating routing rule for customer ${request.customerId}: ${request.dialedNumber} -> ${request.destination}`)
      
      const url = this.buildUrl('/route/create')
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.post(url, {
        customerId: request.customerId,
        dialedNumber: request.dialedNumber,
        callerPattern: request.callerPattern,
        destination: request.destination,
        outgoingCid: request.outgoingCid,
        provider: request.provider,
        promptForDestination: request.promptForDestination || false,
        rulePriority: request.rulePriority || 1,
        active: request.active !== false // default to true
      }, requestConfig)

      return {
        success: true,
        data: response.data,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to create routing rule:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INTERNAL_ERROR,
          message: 'Failed to create routing rule',
          details: { 
            customerId: request.customerId,
            dialedNumber: request.dialedNumber,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Get all routing rules for a customer
   * GET /route/:customerId
   */
  async getCustomerRules(customerId: number): Promise<PBXServiceResponse<GetCustomerRulesResponse>> {
    try {
      logger.info(`Getting routing rules for customer ${customerId}`)
      
      const url = this.buildUrl(`/route/${customerId}`)
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.get(url, requestConfig)

      return {
        success: true,
        data: response.data,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to get customer routing rules:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INTERNAL_ERROR,
          message: 'Failed to get customer routing rules',
          details: { 
            customerId,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Update a routing rule
   * PUT /route/:ruleId
   */
  async updateRoutingRule(ruleId: number, request: UpdateRoutingRuleRequest): Promise<PBXServiceResponse<UpdateRoutingRuleResponse>> {
    try {
      logger.info(`Updating routing rule ${ruleId}`)
      
      const url = this.buildUrl(`/route/${ruleId}`)
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        headers: {
          'Content-Type': 'application/json'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.put(url, request, requestConfig)

      return {
        success: true,
        data: response.data,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to update routing rule:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INTERNAL_ERROR,
          message: 'Failed to update routing rule',
          details: { 
            ruleId,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Delete a routing rule
   * DELETE /route/:ruleId
   */
  async deleteRoutingRule(ruleId: number): Promise<PBXServiceResponse<DeleteRoutingRuleResponse>> {
    try {
      logger.info(`Deleting routing rule ${ruleId}`)
      
      const url = this.buildUrl(`/route/${ruleId}`)
      
      const requestConfig: any = {
        timeout: this.pbxConfig.timeout,
        httpsAgent: new https.Agent({
          rejectUnauthorized: config.env === 'production'
        })
      }

      if (this.pbxConfig.username && this.pbxConfig.password) {
        requestConfig.auth = {
          username: this.pbxConfig.username,
          password: this.pbxConfig.password
        }
      }

      const response = await axios.delete(url, requestConfig)

      return {
        success: true,
        data: response.data,
        timestamp: new Date()
      }
    } catch (error) {
      logger.error('Failed to delete routing rule:', error)
      return {
        success: false,
        error: {
          code: PBXErrorCode.INTERNAL_ERROR,
          message: 'Failed to delete routing rule',
          details: { 
            ruleId,
            originalError: error instanceof Error ? error.message : 'Unknown error'
          }
        },
        timestamp: new Date()
      }
    }
  }

  /**
   * Initialize WebSocket connection for real-time events
   */
  private async initializeWebSocket(): Promise<void> {
    try {
      logger.info('WebSocket initialization skipped (ws package not installed)')
      // Implementation would go here when WebSocket is needed
      // const WebSocket = require('ws')
      // const wsUrl = `ws://${config.pbx.websocketHost}:${config.pbx.websocketPort}/events`
      // this.wsConnection = new WebSocket(wsUrl, ...)
    } catch (error) {
      logger.error('Failed to initialize WebSocket:', error)
      throw error
    }
  }

  /**
   * Handle WebSocket messages
   */
  private handleWebSocketMessage(message: WebSocketEventMessage): void {
    logger.debug('Received WebSocket message:', message.type)

    switch (message.type) {
      case 'system_status':
        this.emit('system_status_update', message.payload as unknown as SystemStatusUpdate)
        break
      
      case 'error':
        logger.error('PBX error received:', message.payload)
        this.emit('pbx_error', message.payload)
        break
      
      default:
        logger.debug('Unhandled WebSocket message type:', message.type)
    }
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.healthCheck()
      } catch (error) {
        logger.error('Heartbeat failed:', error)
        this.emit('connection_lost')
      }
    }, 30000) // 30 seconds
  }

  /**
   * Attempt to reconnect to PBX
   */
  private async attemptReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(async () => {
      try {
        await this.initialize()
        this.reconnectAttempts = 0
        logger.info('Reconnection successful')
      } catch (error) {
        logger.error('Reconnection failed:', error)
        this.attemptReconnection()
      }
    }, 5000 * this.reconnectAttempts) // Exponential backoff
  }

  /**
   * Generate unique call ID
   */
  private generateCallId(): string {
    return `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up PBX service...')
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    if (this.wsConnection) {
      this.wsConnection.close()
    }

    this.eventSubscriptions.clear()
    this.removeAllListeners()
    
    logger.info('PBX service cleanup completed')
  }
}

// Export singleton instance
export const pbxService = new PBXService()

// Export class for testing
export { PBXService }

// Export types for use in other modules
export {
  PBXConfig,
  CallState,
  CallDirection,
  RouteRequest,
  RouteResponse,
  DIDValidationRequest,
  DIDValidationResponse,
  CallLogEntry,
  CallLogFilter,
  PBXStatus,
  PBXError,
  PBXErrorCode,
  PBXServiceResponse
}