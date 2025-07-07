import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { router } from './routers/router'
import { errorHandler } from './middleware/errorHandler'

// Load environment variables
dotenv.config()

const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

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
