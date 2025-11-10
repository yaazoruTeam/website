/**
 * Samsung API Service Layer
 * Handles all Samsung API calls with proper error handling and validation
 */

import axios, { AxiosError } from 'axios'
import * as https from 'https'
import logger from '@/src/utils/logger'
import config from '@/src/config'
import { HttpError, HttpErrorWithStatus } from '@model'
import {
    DeviceInfo,
    MoveGroupRequest,
    MoveGroupResponse,
    SyncDeviceRequest,
    SyncDeviceResponse,
    GroupsList,
    ErrorResponse,
} from './types'

class SamsungService {
    private baseUrl: string
    private bearerToken: string
    private httpsAgent: https.Agent

    constructor() {
        this.baseUrl = config.samsung.urlSamsungApi
        this.bearerToken = config.samsung.bearerToken

        if (!this.baseUrl) {
            throw new Error('SAMSUNG_API_URL not configured')
        }
        if (!this.bearerToken) {
            throw new Error('SAMSUNG_BEARER_TOKEN not configured')
        }

        // Configure HTTPS Agent to handle SSL certificate validation
        // In development, we disable strict certificate validation to work with self-signed certs
        // In production, this is left enabled for security
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: config.node_env === 'production',
        })

        logger.debug(`Samsung Service initialized with SSL validation: ${config.node_env === 'production' ? 'enabled' : 'disabled'}`)
    }

    /**
     * Get common headers for all requests
     */
    private getHeaders() {
        logger.debug('Samsung: Preparing request headers')
        return {
            'Authorization': `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
        }
    }

    /**
     * Get axios config with HTTPS agent
     */
    private getAxiosConfig() {
        return {
            httpsAgent: this.httpsAgent,
        }
    }

    /**
     * Handle API errors with proper logging and conversion to HttpError
     */
    private handleApiError(error: unknown, context: string): never {
        logger.error(`Samsung API Error - ${context}`, { error })

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ErrorResponse>

            const status = axiosError.response?.status || 500
            let message = axiosError.message

            // Extract error message from Samsung API response
            if (axiosError.response?.data?.errorMessage) {
                message = axiosError.response.data.errorMessage
            }

            const httpError = new Error(`Samsung API Error (${status}): ${message}`) as HttpErrorWithStatus.Model
            httpError.status = status
            throw httpError
        }

        // Unknown error
        const httpError = new Error(`Samsung Service Error - ${context}: ${String(error)}`) as HttpErrorWithStatus.Model
        httpError.status = 500
        throw httpError
    }

    /**
     * Get device information by serial number
     * GET /devices/{serialNumber}/info
     */
    async getDeviceInfo(serialNumber: string): Promise<DeviceInfo> {
        try {
            if (!serialNumber || typeof serialNumber !== 'string') {
                throw { status: 400, message: 'Valid serialNumber is required' }
            }

            logger.info(`Samsung: Getting device info for serial: ${serialNumber}`)

            const response = await axios.get<DeviceInfo>(
                `${this.baseUrl}/devices/${serialNumber}/info`,
                { 
                    headers: this.getHeaders(),
                    ...this.getAxiosConfig(),
                }
            )

            logger.debug(`Samsung: Device info retrieved successfully for ${serialNumber}`)
            return response.data
        } catch (error: unknown) {
            this.handleApiError(error, `getDeviceInfo(${serialNumber})`)
        }
    }

    /**
     * Move device to a different group
     * POST /devices/{serialNumber}/moveToGroup
     */
    async moveDeviceToGroup(
        serialNumber: string,
        request: MoveGroupRequest
    ): Promise<MoveGroupResponse> {
        try {
            if (!serialNumber || typeof serialNumber !== 'string') {
                throw { status: 400, message: 'Valid serialNumber is required' }
            }

            if (!request.groupId || !Number.isInteger(request.groupId)) {
                throw { status: 400, message: 'Valid groupId is required' }
            }

            logger.info(
                `Samsung: Moving device ${serialNumber} to group ${request.groupId}`
            )

            const response = await axios.post<MoveGroupResponse>(
                `${this.baseUrl}/devices/${serialNumber}/moveToGroup`,
                { groupId: request.groupId },
                { 
                    headers: this.getHeaders(),
                    ...this.getAxiosConfig(),
                }
            )

            logger.debug(`Samsung: Device ${serialNumber} moved successfully to group ${request.groupId}`)
            return response.data
        } catch (error: unknown) {
            this.handleApiError(error, `moveDeviceToGroup(${serialNumber}, groupId: ${request.groupId})`)
        }
    }

    /**
     * Sync device with server
     * POST /devices/{serialNumber}/sync
     */
    async syncDevice(
        serialNumber: string,
        request?: SyncDeviceRequest
    ): Promise<SyncDeviceResponse> {
        try {
            if (!serialNumber || typeof serialNumber !== 'string') {
                throw { status: 400, message: 'Valid serialNumber is required' }
            }

            const syncRequest: SyncDeviceRequest = {
                forceSync: request?.forceSync ?? false,
            }

            logger.info(
                `Samsung: Syncing device ${serialNumber} (forceSync: ${syncRequest.forceSync})`
            )

            const response = await axios.post<SyncDeviceResponse>(
                `${this.baseUrl}/devices/${serialNumber}/sync`,
                syncRequest,
                { 
                    headers: this.getHeaders(),
                    ...this.getAxiosConfig(),
                }
            )

            logger.debug(`Samsung: Device ${serialNumber} synced successfully`)
            return response.data
        } catch (error: unknown) {
            this.handleApiError(error, `syncDevice(${serialNumber})`)
        }
    }

    /**
     * Get all groups information
     * GET /groups
     */
    async getGroups(excludeGroupId?: number): Promise<GroupsList> {
        try {
            logger.info(`Samsung: Getting groups list${excludeGroupId ? ` (excluding group ${excludeGroupId})` : ''}`)

            const params = excludeGroupId ? { exclude: excludeGroupId } : {}

            const response = await axios.get<GroupsList>(
                `${this.baseUrl}/groups`,
                {
                    headers: this.getHeaders(),
                    params,
                    ...this.getAxiosConfig(),
                }
            )

            logger.debug(`Samsung: Retrieved ${response.data.groups?.length || 0} groups`)
            return response.data
        } catch (error: unknown) {
            this.handleApiError(error, `getGroups(exclude: ${excludeGroupId})`)
        }
    }
}

// Export singleton instance
export default new SamsungService()
