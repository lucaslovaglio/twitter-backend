import request from 'supertest'
import express from 'express'
import { healthRouter } from './health.controller'

const app = express()
app.use('/health', healthRouter)

describe('Health Controller', () => {
  it('should return 200 OK on GET /health', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
  })
})
