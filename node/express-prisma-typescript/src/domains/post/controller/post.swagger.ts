const postComponents = {
  schemas: {
    CreatePostInputDTO: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          maxLength: 240,
          description: 'Content of the post',
          example: 'This is my first post!'
        },
        images: {
          type: 'array',
          items: { type: 'string', maxLength: 4 },
          description: 'Optional images associated with the post',
          example: ['image1.jpg', 'image2.jpg']
        }
      },
      required: ['content']
    },
    PostDTO: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '12345' },
        authorId: { type: 'string', example: '67890' },
        content: { type: 'string', example: 'This is my first post!' },
        images: { type: 'array', items: { type: 'string' }, example: ['image1.jpg'] },
        createdAt: { type: 'string', format: 'date-time', example: '2023-11-14T12:34:56.789Z' }
      }
    },
    ExtendedPostDTO: {
      allOf: [{ $ref: '#/components/schemas/PostDTO' }],
      properties: {
        author: { $ref: '#/components/schemas/ExtendedUserDTO' },
        qtyComments: { type: 'integer', example: 5 },
        qtyLikes: { type: 'integer', example: 20 },
        qtyRetweets: { type: 'integer', example: 8 }
      }
    }
  }
}

export const postDocs = {
  '/api/post': {
    get: {
      summary: 'Get latest posts',
      tags: ['Posts'],
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
            description: 'Maximum number of posts to fetch'
          },
          required: false
        },
        {
          name: 'before',
          in: 'query',
          schema: {
            type: 'string',
            example: '2023-12-31T23:59:59.999Z',
            description: 'Fetch posts created before this timestamp'
          },
          required: false
        },
        {
          name: 'after',
          in: 'query',
          schema: {
            type: 'string',
            example: '2023-01-01T00:00:00.000Z',
            description: 'Fetch posts created after this timestamp'
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'List of latest posts',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: postComponents.schemas.ExtendedPostDTO
              }
            }
          }
        }
      }
    },
    post: {
      summary: 'Create a new post',
      tags: ['Posts'],
      security: [
        {
          bearerAuth: [] // Authentication required for creating a post
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                content: {
                  type: 'string',
                  maxLength: 240,
                  description: 'Content of the post',
                  example: 'This is my first post!'
                },
                images: {
                  type: 'array',
                  items: { type: 'string', maxLength: 4 },
                  description: 'Optional images associated with the post',
                  example: ['image1.jpg', 'image2.jpg']
                }
              },
              required: ['content']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Post successfully created',
          content: {
            'application/json': {
              schema: postComponents.schemas.PostDTO
            }
          }
        },
        400: {
          description: 'Validation error'
        }
      }
    }
  },
  '/api/post/{postId}': {
    get: {
      summary: 'Get a single post by ID',
      tags: ['Posts'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '12345',
            description: 'Unique ID of the post'
          }
        }
      ],
      responses: {
        200: {
          description: 'Post details',
          content: {
            'application/json': {
              schema: postComponents.schemas.ExtendedPostDTO
            }
          }
        },
        404: {
          description: 'Post not found'
        }
      }
    },
    delete: {
      summary: 'Delete a post by ID',
      tags: ['Posts'],
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: '12345',
            description: 'Unique ID of the post'
          }
        }
      ],
      responses: {
        200: {
          description: 'Post successfully deleted'
        },
        404: {
          description: 'Post not found'
        }
      }
    }
  },
  '/api/post/by_user/{userId}': {
    get: {
      summary: 'Get posts by a specific user',
      tags: ['Posts'],
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
            example: '67890',
            description: 'Unique ID of the author'
          }
        }
      ],
      responses: {
        200: {
          description: 'List of posts by the user',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: postComponents.schemas.ExtendedPostDTO
              }
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
