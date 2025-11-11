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
router.get('/status', pbxController.getStatus)
router.post('/initialize', pbxController.initializePBX)

// Call Management Routes
router.post('/route', pbxController.routeCall)
router.post('/route-enhanced', pbxController.routeCallEnhanced)
router.post('/originate', pbxController.originateCall)
router.post('/hangup', pbxController.hangupCall)
router.post('/transfer', pbxController.transferCall)

// DID Validation Routes
router.post('/validate-did', pbxController.validateDID)

// Call Information Routes
router.get('/active-calls', pbxController.getActiveCalls)
router.get('/call/:callId', pbxController.getCallSession)
router.get('/call-logs', pbxController.getCallLogs)

export default router