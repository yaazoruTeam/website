import config from "@/src/config"
import logger from "@/src/utils/logger"
import axios from "axios"

export const getSwitchboard = async (endpoint: string, data?: any) => {
    try {
        logger.info(`Making request to Switchboard API: ${config.switchboard.apiUrl}/${endpoint}`)
        const response = await axios.get(`${config.switchboard.apiUrl}/${endpoint}`, { params: data })
        logger.info(`Switchboard API response received successfully`)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logger.error(`Switchboard API error: ${error.message}`, {
                status: error.response?.status,
                data: error.response?.data
            })
            throw new Error(`Switchboard API failed: ${error.message}`)
        }
        throw error
    }
}

export const postSwitchboard = async (endpoint: string, data: any) => {
    try {
        logger.info(`Making POST request to Switchboard API: ${config.switchboard.apiUrl}/${endpoint}`)
        logger.debug(`POST data: ${JSON.stringify(data)}`)
        const response = await axios.post(`${config.switchboard.apiUrl}/${endpoint}`, data)
        logger.info(`Switchboard API POST response received successfully`)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            logger.error(`Switchboard API POST error: ${error.message}`, {
                status: error.response?.status,
                data: error.response?.data
            })
            throw new Error(`Switchboard API POST failed: ${error.message}`)
        }
        throw error
    }
}