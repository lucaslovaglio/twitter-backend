const roomDocs = {
  '/api/chat/': {
    post: {
      summary: 'Create a chat room',
      tags: ['Room'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Study Group',
                  description: 'Name of the room to be created'
                },
                ownerId: {
                  type: 'string',
                  example: '63a5f20b1c4e88eae4a0b89f',
                  description: 'ID of the user creating the room'
                }
              },
              required: ['name', 'ownerId']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Room created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  roomId: {
                    type: 'string',
                    example: '63a5f20b1c4e88eae4a0c123',
                    description: 'Unique ID of the created room'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Validation error (missing required fields or invalid data)'
        }
      }
    }
  },
  '/api/chat/:roomId/joinUser/:targetUserId': {
    post: {
      summary: 'Add a user to a room',
      tags: ['Room'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                roomId: {
                  type: 'string',
                  example: '63a5f20b1c4e88eae4a0c123',
                  description: 'ID of the room'
                },
                userId: {
                  type: 'string',
                  example: '63a5f20b1c4e88eae4a0b89f',
                  description: 'ID of the user to add to the room'
                }
              },
              required: ['roomId', 'userId']
            }
          }
        }
      },
      responses: {
        200: {
          description: 'User added to the room successfully'
        },
        404: {
          description: 'Room not found'
        },
        409: {
          description: 'User is already in the room'
        }
      }
    }
  },
  '/api/chat': {
    get: {
      summary: 'Get user rooms',
      tags: ['Room'],
      parameters: [
        {
          name: 'userId',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            example: '63a5f20b1c4e88eae4a0b89f'
          },
          description: 'ID of the user'
        }
      ],
      responses: {
        200: {
          description: 'Rooms retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    roomId: {
                      type: 'string',
                      example: '63a5f20b1c4e88eae4a0c123'
                    },
                    name: {
                      type: 'string',
                      example: 'Study Group'
                    },
                    ownerId: {
                      type: 'string',
                      example: '63a5f20b1c4e88eae4a0b89f'
                    },
                    participants: {
                      type: 'array',
                      items: {
                        type: 'string',
                        example: '63a5f20b1c4e88eae4a0b89f'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'No rooms found for the user'
        }
      }
    }
  },
  '/api/chat/:roomId/history': {
    get: {
      summary: 'Get message history for a room',
      tags: ['Room'],
      parameters: [
        {
          name: 'roomId',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            example: '63a5f20b1c4e88eae4a0c123'
          },
          description: 'ID of the room'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            example: 50,
            description: 'Maximum number of messages to retrieve'
          }
        },
        {
          name: 'offset',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            example: 0,
            description: 'Number of messages to skip before starting to return results'
          }
        }
      ],
      responses: {
        200: {
          description: 'Messages retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    messageId: {
                      type: 'string',
                      example: '63a5f20b1c4e88eae4a0b8a0'
                    },
                    senderId: {
                      type: 'string',
                      example: '63a5f20b1c4e88eae4a0b89f'
                    },
                    content: {
                      type: 'string',
                      example: 'Let’s meet tomorrow'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-12-03T10:15:30Z'
                    }
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Room not found'
        }
      }
    }
  }
}

export default roomDocs
