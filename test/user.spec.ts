import { execSync } from 'node:child_process'
import { it, describe, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

import { createUserMock } from './mocks/createUserMock'
import { User } from '../src/users/models/user'

describe('User routes', () => {
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

  describe('Create User', async () => {
    const { name, email, height, password, weight } = createUserMock

    it('should not be able to create a new user without name', async () => {
      await request(app.server)
        .post('/users')
        .send({
          email,
          password,
          height,
          weight,
        })
        .expect(400)
    })

    it('should not be able to create a new user without email', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name,
          password,
          height,
          weight,
        })
        .expect(400)
    })

    it('should not be able to create a new user without password', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          height,
          weight,
        })
        .expect(400)
    })

    it('should not be able to create a new user without height', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          weight,
        })
        .expect(400)
    })

    it('should not be able to create a new user without weight', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          height,
        })
        .expect(400)
    })

    it('should not be able to create a new user if already exists', async () => {
      await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      // Create the same user
      const createUserResponse = await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          height,
          weight,
        })
        .expect(400)

      const { message } = createUserResponse.body

      expect(message).toEqual('Email already exists')
    })

    it('should be able to create a new user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          height,
          weight,
        })
        .expect(201)
    })
  })

  describe('Show User', async () => {
    it('should be able to show user', async () => {
      const { name, email, height, password, weight } = createUserMock

      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      const userCreated: User = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      // Get User
      const responseGetUser = await request(app.server)
        .get(`/users/${userCreated.id}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(responseGetUser.body.user).toEqual(
        expect.objectContaining({
          name,
          email,
          height,
          weight,
        }),
      )
    })

    it.skip('should not be able to show user if user doesnt exist', async () => {
      const { name, email, height, password, weight } = createUserMock

      /* Create User */
      await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      // Get User
      const response = await request(app.server)
        .get(`/users/${wrongId}`)
        .set('Cookie', cookies)

      console.log(response.body)
    })

    it('should not be able to show user without cookie userId', async () => {
      const { name, email, height, password, weight } = createUserMock

      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      const userCreated: User = responseCreateUser.body.user[0]

      // Get User
      await request(app.server).get(`/users/${userCreated.id}`).expect(401)
    })
  })

  describe('Update User', async () => {
    const { name, email, height, password, weight } = createUserMock

    const updateUserMock = {
      name: 'User Test Updated',
      email: 'userTestUpdated@email.com',
    }

    let userCreated: User | null = null

    let cookies: string[] = []

    beforeEach(async () => {
      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      userCreated = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      cookies = createSessionResponse.get('Set-Cookie')
    })

    it('should not be able to update user without name', async () => {
      await request(app.server)
        .put(`/users/${userCreated?.id}`)
        .set('Cookie', cookies)
        .send({
          email: updateUserMock.email,
        })
        .expect(400)
    })

    it('should not be able to update user without email', async () => {
      await request(app.server)
        .put(`/users/${userCreated?.id}`)
        .set('Cookie', cookies)
        .send({
          name: updateUserMock.name,
        })
        .expect(400)
    })

    it.skip('should not be able to update user if  user doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .put(`/users/${wrongId}`)
        .set('Cookie', cookies)
        .send({
          name: updateUserMock.name,
          email: updateUserMock.email,
        })
        .expect(400)
    })

    it('should be able to update user', async () => {
      const updateUser = {
        name: 'User Test Updated',
        email: 'userTestUpdated@email.com',
        height: 1.8,
        weight: 80,
      }

      const responseUpdatePasswordUser = await request(app.server)
        .put(`/users/${userCreated?.id}`)
        .set('Cookie', cookies)
        .send({
          name: updateUser.name,
          email: updateUser.email,
        })
        .expect(200)

      expect(responseUpdatePasswordUser.body.user).toEqual([
        expect.objectContaining({
          name: updateUser.name,
          email: updateUser.email,
        }),
      ])
    })
  })

  describe('Update User Password', async () => {
    const { name, email, height, password, weight } = createUserMock

    let userCreated: User | null = null

    let cookies: string[] = []

    beforeEach(async () => {
      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      userCreated = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      cookies = createSessionResponse.get('Set-Cookie')
    })

    it('should be able to update user password', async () => {
      const responseUpdatePasswordUser = await request(app.server)
        .patch(`/users/${userCreated?.id}/password`)
        .set('Cookie', cookies)
        .send({
          password: 'newPassword',
        })
        .expect(200)

      expect(responseUpdatePasswordUser.body.user).toEqual([
        expect.objectContaining({
          name,
          email,
          height,
          weight,
        }),
      ])
    })

    it('should not be able to update user password if cookie userId is invalid', async () => {
      await request(app.server)
        .patch(`/users/${userCreated?.id}/password`)
        .send({
          password: 'newPassword',
        })
        .expect(401)
    })
  })

  describe('Update User Height and Weight', async () => {
    const { name, email, height, password, weight } = createUserMock
    const updateWeightAndHeightMock = {
      newWeight: 80,
      newHeight: 1.8,
    }

    let userCreated: User | null = null

    let cookies: string[] = []

    beforeEach(async () => {
      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      userCreated = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      cookies = createSessionResponse.get('Set-Cookie')
    })

    it('should be able to update user height and weight', async () => {
      const responseUpdatePasswordUser = await request(app.server)
        .patch(`/users/${userCreated?.id}/heightAndWeight`)
        .set('Cookie', cookies)
        .send({
          weight: updateWeightAndHeightMock.newWeight,
          height: updateWeightAndHeightMock.newHeight,
        })
        .expect(200)

      expect(responseUpdatePasswordUser.body.user).toEqual([
        expect.objectContaining({
          name,
          email,
          height: updateWeightAndHeightMock.newHeight,
          weight: updateWeightAndHeightMock.newWeight,
        }),
      ])
    })

    it('should not be able to update user height and weight without height', async () => {
      await request(app.server)
        .patch(`/users/${userCreated?.id}/heightAndWeight`)
        .set('Cookie', cookies)
        .send({
          weight: updateWeightAndHeightMock.newWeight,
        })
        .expect(400)
    })

    it('should not be able to update user height and weight without weight', async () => {
      await request(app.server)
        .patch(`/users/${userCreated?.id}/heightAndWeight`)
        .set('Cookie', cookies)
        .send({
          height: updateWeightAndHeightMock.newHeight,
        })
        .expect(400)
    })

    it('should not be able to update user height and weight if cookie userId is invalid', async () => {
      await request(app.server)
        .patch(`/users/${userCreated?.id}/heightAndWeight`)
        .send({
          height: updateWeightAndHeightMock.newHeight,
        })
        .expect(401)
    })

    it('should not be able to update user if  user doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .patch(`/users/${wrongId}/heightAndWeight`)
        .send({
          height: updateWeightAndHeightMock.newHeight,
        })
        .expect(401)
    })
  })

  describe('Update User Height and Weight', async () => {
    const { name, email, height, password, weight } = createUserMock

    let userCreated: User | null = null

    let cookies: string[] = []

    beforeEach(async () => {
      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name,
        email,
        password,
        height,
        weight,
      })

      userCreated = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      cookies = createSessionResponse.get('Set-Cookie')
    })

    it('should be able to delete user', async () => {
      await request(app.server)
        .delete(`/users/${userCreated?.id}`)
        .set('Cookie', cookies)
        .expect(204)
    })

    it('should not be able to delete user if  user doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server).delete(`/users/${wrongId}`).expect(401)
    })
  })
})
