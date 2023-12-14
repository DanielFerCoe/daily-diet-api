import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { createUserMock } from './mocks/createUserMock'

describe('Session routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new session', async () => {
    const { name, email, height, password, weight } = createUserMock[0]

    await request(app.server).post('/users').send({
      name,
      email,
      password,
      height,
      weight,
    })

    const createSessionResponse = await request(app.server)
      .post('/session')
      .send({ email, password })
      .expect(201)

    const cookies = createSessionResponse.get('Set-Cookie')

    expect(cookies).toMatch(/userId=/)
  })

  it('should not be able to create a new session with wrong password', async () => {
    const { name, email, height, password, weight } = createUserMock[0]

    await request(app.server).post('/users').send({
      name,
      email,
      password,
      height,
      weight,
    })

    const createSessionWithWrongPasswordResponse = await request(app.server)
      .post('/session')
      .send({ email, password: 'wrongPassword' })
      .expect(400)

    const cookiesWithWrongPasswordResponse =
      createSessionWithWrongPasswordResponse.get('Set-Cookie')

    expect(cookiesWithWrongPasswordResponse).not.toMatch(/userId=/)
  })

  it('should not be able to create a new session with wrong email', async () => {
    const { name, email, height, password, weight } = createUserMock[0]

    await request(app.server).post('/users').send({
      name,
      email,
      password,
      height,
      weight,
    })

    const createSessionWithWrongEmailResponse = await request(app.server)
      .post('/session')
      .send({ email: 'wrongTeste.email.com', password })
      .expect(400)

    const cookiesWithWrongEmailResponse =
      createSessionWithWrongEmailResponse.get('Set-Cookie')

    expect(cookiesWithWrongEmailResponse).not.toMatch(/userId=/)
  })
})
