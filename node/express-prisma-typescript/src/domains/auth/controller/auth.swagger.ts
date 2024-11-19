const authDocs = {
  '/api/auth/login': {
    post: {
      summary: 'User login',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                  description: 'Optional if username is provided'
                },
                username: {
                  type: 'string',
                  example: 'exampleUser',
                  description: 'Optional if email is provided'
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'StrongPassword@123',
                  description: 'Must meet strong password requirements'
                }
              },
              required: ['password'], // Only password is always required
              oneOf: [
                { required: ['email'] },
                { required: ['username'] }
              ]
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successful login',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5...'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Validation error (missing required fields or weak password)'
        },
        401: {
          description: 'Invalid credentials'
        }
      }
    }
  },
  '/api/auth/signup': {
    post: {
      summary: 'User signup',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                  description: 'Must be a valid email address'
                },
                username: {
                  type: 'string',
                  example: 'newUser',
                  description: 'Username must not be empty'
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'StrongPassword@123',
                  description: 'Must meet strong password requirements'
                }
              },
              required: ['email', 'username', 'password']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User successfully registered',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5...'
                  }
                }
              }
            }
          }
        },
        400: {
          description: 'Validation error (invalid email, weak password, etc.)'
        },
        409: {
          description: 'User already exists'
        }
      }
    }
  }
}

export default authDocs
