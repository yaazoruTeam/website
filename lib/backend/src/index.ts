import express, { Request, Response } from 'express'
import { router } from './routers/router'
import { errorHandler } from './middleware/errorHandler'
import config from './config'

const cors = require('cors')

const app = express()
const PORT = config.server.port

// Middleware
app.use(cors())
app.use(express.json())

app.use(router)
app.use(errorHandler)
// sendPing();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
