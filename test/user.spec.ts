import { execSync } from 'node:child_process'
import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

import { createUserMock } from './mocks/createUserMock'
import { User } from '../src/users/models/user'

describe('User routes', async () => {
  beforeAll(async () => {
    await app.ready()

    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  let userCreated: User = {} as User

  describe('Create User', async () => {
    const { name, email, height, password, weight } = createUserMock[0]

    it('should be able to create a new user', async () => {
      const responseCreateUser = await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          height,
          weight,
        })
        .expect(201)

      userCreated = responseCreateUser.body.user[0]
    })

    it('should not be able to create a new user if already exists', async () => {
      // Create the same user
      await request(app.server)
        .post('/users')
        .send({
          name,
          email,
          password,
          height,
          weight,
        })
        .expect(400)
    })
  })

  describe('Show User', async () => {
    const { name, email, height, password, weight } = createUserMock[0]

    it('should be able to show user', async () => {
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

    it('should not be able to show user if user doesnt exist', async () => {
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
      await request(app.server)
        .get(`/users/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to show user without cookie userId', async () => {
      await request(app.server).get(`/users/${userCreated.id}`).expect(401)
    })
  })

  describe('Update User', async () => {
    it('should not be able to update user if  user doesnt exist', async () => {
      const { email, password } = createUserMock[0]

      const { email: updateEmail, name: updateName } = createUserMock[1]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .put(`/users/${wrongId}`)
        .set('Cookie', cookies)
        .send({
          name: updateName,
          email: updateEmail,
        })
        .expect(400)
    })

    it('should be able to update user', async () => {
      const { email, password } = createUserMock[0]

      const { email: updateEmail, name: updateName } = createUserMock[1]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')
      const responseUpdatePasswordUser = await request(app.server)
        .put(`/users/${userCreated.id}`)
        .set('Cookie', cookies)
        .send({
          name: updateName,
          email: updateEmail,
        })
        .expect(200)

      expect(responseUpdatePasswordUser.body.user).toEqual(
        expect.objectContaining({
          name: updateName,
          email: updateEmail,
        }),
      )
    })
  })

  describe('Update User Password', async () => {
    // user before updated
    const { password } = createUserMock[0]

    // user updated
    const { email, password: updatePassword } = createUserMock[1]

    it('should be able to update user password', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      await request(app.server)
        .patch(`/users/${userCreated.id}/password`)
        .set('Cookie', cookies)
        .send({
          password: updatePassword,
        })
        .expect(200)
    })

    it('should not be able to update user password if cookie userId is invalid', async () => {
      await request(app.server)
        .patch(`/users/${userCreated.id}/password`)
        .send({
          password: updatePassword,
        })
        .expect(401)
    })
  })

  describe('Update User Height and Weight', async () => {
    const { name, email, password, height, weight } = createUserMock[1]

    it('should be able to update user height and weight', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      const responseUpdatePasswordUser = await request(app.server)
        .patch(`/users/${userCreated.id}/heightAndWeight`)
        .set('Cookie', cookies)
        .send({
          weight,
          height,
        })
        .expect(200)

      expect(responseUpdatePasswordUser.body.user).toEqual(
        expect.objectContaining({
          name,
          email,
          height,
          weight,
        }),
      )
    })

    it('should not be able to update user height and weight if cookie userId is invalid', async () => {
      await request(app.server)
        .patch(`/users/${userCreated.id}/heightAndWeight`)
        .send({
          height,
          weight,
        })
        .expect(401)
    })

    it('should not be able to update user if  user doesnt exist', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .patch(`/users/${wrongId}/heightAndWeight`)
        .set('Cookie', cookies)
        .send({
          height,
        })
        .expect(400)
    })
  })

  describe('Delete User', async () => {
    const { email, password } = createUserMock[1]
    it('should not be able to delete user if  user doesnt exist', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .delete(`/users/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to delete user', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email,
          password,
        })

      const cookies = createSessionResponse.get('Set-Cookie')

      await request(app.server)
        .delete(`/users/${userCreated.id}`)
        .set('Cookie', cookies)
        .expect(204)
    })
  })
})
