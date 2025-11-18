import { Router } from 'express'
import * as simCardController from '@controller/simCard'
import { hasRole } from '@middleware/auth'

const simCardRouter = Router()

/**
 * ===============================
 * CRUD Operations
 * ===============================
 */

/**
 * POST /sim-cards
 * Create a new SIM card
 * Required body: {simNumber, user_id, device_id, receivedAt?, planEndDate?}
 * Access: admin, branch
 */
simCardRouter.post('/', hasRole('admin', 'branch'), simCardController.createSimCard)

/**
 * POST /sim-cards/device-with-sim
 * Create Device with SIM Card in a transaction
 * Body: {
 *   device?: {device_number, IMEI_1, model, serialNumber, plan?, purchaseDate?},
 *   simCard: {simNumber, user_id, receivedAt?, planEndDate?}
 * }
 * If device data: creates device + simcard and links them
 * If no device data: creates only simcard
 * Access: admin, branch
 */
simCardRouter.post(
  '/device-with-sim',
  hasRole('admin', 'branch'),
  simCardController.createDeviceWithSimCard,
)

/**
 * ===============================
 * Special Queries (צריך להיות לפני ה-/:id)
 * ===============================
 */

/**
 * GET /sim-cards/page/:page
 * Get all SIM cards with pagination
 * Access: admin, branch
 */
simCardRouter.get('/page/:page', hasRole('admin', 'branch'), simCardController.getSimCards)

/**
 * GET /sim-cards/with-devices/page/:page
 * Get all SIM cards with joined device information and pagination
 * Access: admin, branch
 */
simCardRouter.get(
  '/with-devices/page/:page',
  hasRole('admin', 'branch'),
  simCardController.getSimCardsWithDevices,
)

/**
 * GET /sim-cards/without-customer/page/:page
 * Get SIM cards without customer but with device
 * Fetches SIM cards that have a device assigned but no customer linked
 * Useful for finding devices awaiting customer assignment
 * Access: admin, branch
 */
simCardRouter.get(
  '/without-customer/page/:page',
  hasRole('admin', 'branch'),
  simCardController.getSimCardsWithoutCustomerButWithDevice,
)

/**
 * GET /sim-cards/number/:simNumber
 * Get SIM card by SIM number
 * Access: admin, branch
 */
simCardRouter.get('/number/:simNumber', hasRole('admin', 'branch'), simCardController.getSimCardByNumber)

/**
 * GET /sim-cards/customer/:customer_id/page/:page
 * Get all SIM cards for a specific customer
 * Access: admin, branch
 */
simCardRouter.get(
  '/customer/:customer_id/page/:page',
  hasRole('admin', 'branch'),
  simCardController.getSimCardsByCustomerId,
)

/**
 * GET /sim-cards/customer/:customer_id/count
 * Get count of SIM cards for a specific customer
 * Access: admin, branch
 */
simCardRouter.get(
  '/customer/:customer_id/count',
  hasRole('admin', 'branch'),
  simCardController.getSimCardsCountByCustomerId,
)

/**
 * GET /sim-cards/device/:device_id
 * Get SIM card by device ID (one-to-one relationship)
 * Access: admin, branch
 */
simCardRouter.get(
  '/device/:device_id',
  hasRole('admin', 'branch'),
  simCardController.getSimCardByDeviceId,
)

/**
 * GET /sim-cards/expiring/page/:page?days=30
 * Get SIM cards expiring soon
 * Query param: days (default: 30)
 * Access: admin, branch
 */
simCardRouter.get(
  '/expiring/page/:page',
  hasRole('admin', 'branch'),
  simCardController.getExpiringSimCards,
)

/**
 * GET /sim-cards/date-range/page/:page?startDate=2024-01-01&endDate=2024-12-31
 * Get SIM cards by date range
 * Query params: startDate, endDate
 * Access: admin, branch
 */
simCardRouter.get(
  '/date-range/page/:page',
  hasRole('admin', 'branch'),
  simCardController.getSimCardsByDateRange,
)

/**
 * GET /sim-cards/count
 * Get total count of SIM cards
 * Access: admin, branch
 */
simCardRouter.get('/count', hasRole('admin', 'branch'), simCardController.getSimCardsCount)

/**
 * PATCH /sim-cards/:id/plan-end-date
 * Update SIM card plan end date
 * Body: {planEndDate: Date}
 * Access: admin, branch
 */
simCardRouter.patch(
  '/:id/plan-end-date',
  hasRole('admin', 'branch'),
  simCardController.updatePlanEndDate,
)

/**
 * ===============================
 * Generic CRUD Routes (צריך להיות בסוף!)
 * ===============================
 */

/**
 * GET /sim-cards/:id
 * Get SIM card by ID
 * Access: admin, branch
 */
simCardRouter.get('/:id', hasRole('admin', 'branch'), simCardController.getSimCardById)

/**
 * PATCH /sim-cards/:id
 * Update SIM card
 * Access: admin, branch
 */
simCardRouter.put('/:id', hasRole('admin', 'branch'), simCardController.updateSimCard)

/**
 * DELETE /sim-cards/:id
 * Delete SIM card
 * Access: admin
 */
simCardRouter.delete('/:id', hasRole('admin'), simCardController.deleteSimCard)

export default simCardRouter

