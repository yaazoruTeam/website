/**
 * PBX Configuration Types
 * 
 * This module contains TypeScript interfaces and types for PBX configuration
 */

export interface PBXConfig {
  host: string
  port: number
  protocol: 'http' | 'https'
  apiPath?: string
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
  username?: string
  password?: string
}