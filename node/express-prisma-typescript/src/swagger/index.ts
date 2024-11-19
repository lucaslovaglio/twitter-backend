import authDocs from '../domains/auth/controller/auth.swagger'
import followerDocs from '../domains/follower/controller/follower.swagger'
// import postDocs from '../domains/post/controller/post.swagger'

import { Constants } from '@utils'

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import userDocs from '@domains/user/controller/user.swagger'
import healthDocs from '@domains/health/controller/health.swagger'
import { postDocs } from '@domains/post/controller/post.swagger'

const paths = {
  ...healthDocs,
  ...authDocs,
  ...followerDocs,
  ...userDocs,
  ...postDocs
}

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation'
    },
    servers: [
      {
        url: `http://localhost:${Constants.PORT}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths
  },
  apis: []
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

export { swaggerUi, swaggerSpec }
