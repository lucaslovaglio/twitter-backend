const followerDocs = {
  '/api/follower/follow/{followedId}': {
    post: {
      summary: 'Follow a user',
      tags: ['Followers'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'followedId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '12345',
            description: 'The ID of the user to follow'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully followed the user',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  followerId: { type: 'string', example: '67890' },
                  followedId: { type: 'string', example: '12345' },
                  followedAt: { type: 'string', format: 'date-time', example: '2023-11-15T12:34:56.789Z' }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized'
        },
        404: {
          description: 'User to follow not found'
        }
      }
    }
  },
  '/api/follower/unfollow/{followedId}': {
    delete: {
      summary: 'Unfollow a user',
      tags: ['Followers'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'followedId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '12345',
            description: 'The ID of the user to unfollow'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully unfollowed the user'
        },
        401: {
          description: 'Unauthorized'
        },
        404: {
          description: 'User to unfollow not found'
        }
      }
    }
  },
  '/api/follower/all': {
    get: {
      summary: 'Get all followers for the current user',
      tags: ['Followers'],
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: 'List of followers',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    followerId: { type: 'string', example: '67890' },
                    followerUsername: { type: 'string', example: 'user123' },
                    followedAt: { type: 'string', format: 'date-time', example: '2023-11-15T12:34:56.789Z' }
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized'
        }
      }
    }
  }
}

export default followerDocs
