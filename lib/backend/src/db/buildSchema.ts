import { createSchema } from '@db/schema'
import logger from '../utils/logger';

createSchema()
;(async () => {
  try {
    logger.debug('build schema---------------------')
    await createSchema()
    logger.info('Schema creation completed. Starting app...')
  } catch (err) {
    logger.error('Error during schema creation', err)
  }
})()
