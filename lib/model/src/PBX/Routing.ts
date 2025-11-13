/**
 * PBX Routing Types - Types for routing rule management
 * 
 * Types for creating, updating, and managing routing rules in NodeRouting
 */

// ===============================
// Base Routing Rule Interface
// ===============================

export interface RoutingRule {
  id: number
  customerId: number
  dialedNumber: string
  callerPattern: string
  destination: string
  outgoingCid: string
  provider: string
  promptForDestination: boolean
  rulePriority: number
  active: boolean
  createdAt: Date
}

// ===============================
// Create Routing Rule Types
// ===============================

export interface CreateRoutingRuleRequest {
  customerId: number
  dialedNumber: string
  callerPattern: string
  destination: string
  outgoingCid: string
  provider: string
  promptForDestination?: boolean
  rulePriority?: number
  active?: boolean
}

export interface CreateRoutingRuleResponse {
  success: boolean
  message: string
  data: RoutingRule
}

// ===============================
// Update Routing Rule Types
// ===============================

export interface UpdateRoutingRuleRequest {
  customerId?: number
  dialedNumber?: string
  callerPattern?: string
  destination?: string
  outgoingCid?: string
  provider?: string
  promptForDestination?: boolean
  rulePriority?: number
  active?: boolean
}

export interface UpdateRoutingRuleResponse {
  success: boolean
  message: string
  data: RoutingRule
}

// ===============================
// Get Customer Rules Types
// ===============================

export interface GetCustomerRulesResponse {
  success: boolean
  data: RoutingRule[]
  count: number
}

// ===============================
// Delete Routing Rule Types
// ===============================

export interface DeleteRoutingRuleResponse {
  success: boolean
  message: string
}

