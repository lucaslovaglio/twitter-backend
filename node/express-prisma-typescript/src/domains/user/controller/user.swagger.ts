const userDocs = {
  '/api/user': {
    get: {
      summary: 'Get user recommendations',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            example: 10,
            description: 'Maximum number of users to fetch'
          },
          required: false
        },
        {
          name: 'skip',
          in: 'query',
          schema: {
            type: 'integer',
            example: 5,
            description: 'Number of users to skip (for pagination)'
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'List of user recommendations',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/UserDTO' }
              }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete the current user',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'User successfully deleted'
        },
        401: {
          description: 'Unauthorized'
        }
      }
    }
  },
  '/api/user/me': {
    get: {
      summary: 'Get details of the current user',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'Details of the current user',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserDTO' }
            }
          }
        },
        401: {
          description: 'Unauthorized'
        }
      }
    }
  },
  '/api/user/{userId}': {
    get: {
      summary: 'Get details of a specific user',
      tags: ['Users'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '12345',
            description: 'Unique ID of the user'
          }
        }
      ],
      responses: {
        200: {
          description: 'Details of the specified user',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserDTO' }
            }
          }
        },
        404: {
          description: 'User not found'
        }
      }
    }
  }
}

export default userDocs


const components = {
  schemas: {
    UserDTO: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '12345' },
        username: { type: 'string', example: 'exampleUser' },
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        profilePicture: {
          type: 'string',
          format: 'uri',
          example: 'https://example.com/profile.jpg'
        },
        bio: { type: 'string', example: 'This is a short bio' },
        createdAt: { type: 'string', format: 'date-time', example: '2023-11-15T12:34:56.789Z' }
      }
    }
  }
}
