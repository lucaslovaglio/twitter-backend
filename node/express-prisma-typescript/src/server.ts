import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import { swaggerSpec, swaggerUi } from '@swagger'
import { SocketService } from '@domains/socket/service/socket.service';
import { SocketServiceImpl } from '@domains/socket/service/socket.service.impl';

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: Constants.CORS_WHITELIST
  }
})

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', router)

app.use(ErrorHandling)

// Initialize socket service
const socketService: SocketService = new SocketServiceImpl(io)
socketService.initialize()

// Start the server
httpServer.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})
