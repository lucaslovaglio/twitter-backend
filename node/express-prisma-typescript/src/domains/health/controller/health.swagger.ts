const healthDocs = {
  '/api/health': {
    get: {
      summary: 'Health check endpoint',
      description: 'Checks the health of the server. Returns 200 OK if the server is running.',
      tags: ['Health'],
      responses: {
        200: {
          description: 'Server is healthy'
        }
      }
    }
  }
}

export default healthDocs
