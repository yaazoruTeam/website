/**
 * PBX Router - Express routes for PBX functionality
 * 
 * This file defines all PBX-related API routes and maps them to controller functions.
 */

import { Router } from 'express'
import * as pbxController from '../controller/pbx'

const router = Router()

// Health and Status Routes
router.get('/health', pbxController.healthCheck)
router.post('/initialize', pbxController.initializePBX)

// Call Management Routes
router.post('/route', pbxController.routeCall)

// DID Validation Routes
router.post('/validate-did', pbxController.validateDID)

// Call Information Routes
router.get('/call-logs', pbxController.getCallLogs)

// Routing Rule Management Routes
router.post('/routing-rules', pbxController.createRoutingRule)
router.get('/routing-rules/:customerId', pbxController.getCustomerRoutingRules)
router.put('/routing-rules/:ruleId', pbxController.updateRoutingRule)
router.delete('/routing-rules/:ruleId', pbxController.deleteRoutingRule)

export default router