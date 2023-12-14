import { execSync } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { createMealMock } from './mocks/createMealMock'
import { createUserMock } from './mocks/createUserMock'
import { User } from '../src/users/models/user'
import { Meal } from '../src/meals/models/meal'

describe('Meals routes', async () => {
  beforeAll(async () => {
    await app.ready()

    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  const mealMock = createMealMock[0]

  const userMock = createUserMock[0]

  let userCreated: User = {} as User

  let mealCreated: Meal = {} as Meal

  let cookies: string[] = []

  describe('Create meal', async () => {
    it('should not be able to create a new meal without cookie userId', async () => {
      /* Create User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name: userMock.name,
        email: userMock.email,
        password: userMock.password,
        height: userMock.height,
        weight: userMock.weight,
      })

      userCreated = responseCreateUser.body.user[0]

      await request(app.server)
        .post('/meals')
        .send({
          name: mealMock.name,
          date: mealMock.date,
          description: mealMock.description,
          inTheDiet: mealMock.inTheDiet,
          userId: userCreated.id,
        })
        .expect(401)
    })

    it('should not be able to create a new meal without userId', async () => {
      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email: userMock.email,
          password: userMock.password,
        })

      cookies = createSessionResponse.get('Set-Cookie')

      await request(app.server)
        .post('/meals')
        .send({
          description: mealMock.description,
          name: mealMock.name,
          date: mealMock.date,
          inTheDiet: mealMock.inTheDiet,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to create a new meal', async () => {
      const responseMealCreated = await request(app.server)
        .post('/meals')
        .send({
          description: mealMock.description,
          name: mealMock.name,
          date: mealMock.date,
          inTheDiet: !!mealMock.inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(201)

      mealCreated = responseMealCreated.body.meal
    })

    it('should not be able to create a new meal if meal already exists', async () => {
      await request(app.server)
        .post('/meals')
        .send({
          description: mealMock.description,
          name: mealMock.name,
          date: mealMock.date,
          inTheDiet: !!mealMock.inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })
  })

  describe('List meal', async () => {
    it('should not be able to list meals by another user', async () => {
      const anotherUser = createUserMock[1]

      /* Create Another User */
      await request(app.server).post('/users').send({
        name: anotherUser.name,
        email: anotherUser.email,
        password: anotherUser.password,
        height: anotherUser.height,
        weight: anotherUser.weight,
      })

      /* Create Session */
      const createAnotherSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email: anotherUser.email,
          password: anotherUser.password,
        })

      const cookiesAnotherUser = createAnotherSessionResponse.get('Set-Cookie')

      /* List Meal */
      const responseListMeals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookiesAnotherUser)
        .expect(200)

      expect(responseListMeals.body.meals).toEqual([])
    })

    it('should be able to list meals', async () => {
      /* LIst Meal */
      const responseListMeals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      expect(responseListMeals.body.meals[0]).toEqual(
        expect.objectContaining({
          name: mealCreated.name,
          date: new Date(mealCreated.date).toISOString(),
          description: mealCreated.description,
          inTheDiet: mealCreated.inTheDiet,
        }),
      )
    })
  })

  describe('Show meal', async () => {
    it('should not be able to show meal if meal doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .get(`/meals/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to show meals', async () => {
      const responseListMeals = await request(app.server)
        .get(`/meals/${mealCreated.id}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(responseListMeals.body.meal).toEqual(
        expect.objectContaining({
          name: mealCreated.name,
          date: new Date(mealCreated.date).toISOString(),
          description: mealCreated.description,
          inTheDiet: mealCreated.inTheDiet,
        }),
      )
    })
  })

  describe('Update meal', async () => {
    it('should not be able to show meal if meal doesnt exist', async () => {
      const mealUpdateMock = createMealMock[1]

      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .put(`/meals/${wrongId}`)
        .send({
          description: mealUpdateMock.description,
          name: mealUpdateMock.name,
          date: mealUpdateMock.date,
          inTheDiet: !!mealUpdateMock.inTheDiet,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to update a meal', async () => {
      const mealUpdateMock = createMealMock[1]

      const responseUpdateMeal = await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          name: mealUpdateMock.name,
          description: mealUpdateMock.description,
          date: mealUpdateMock.date,
          inTheDiet: !!mealUpdateMock.inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(200)

      expect(responseUpdateMeal.body.meal).toEqual(
        expect.objectContaining({
          name: mealUpdateMock.name,
          description: mealUpdateMock.description,
          date: new Date(mealUpdateMock.date).toISOString(),
          inTheDiet: mealUpdateMock.inTheDiet,
        }),
      )
    })
  })

  describe('Delete meal', async () => {
    it('should not be able to delete meal if meal doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .delete(`/meals/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to delete meal', async () => {
      await request(app.server)
        .delete(`/meals/${mealCreated.id}`)
        .set('Cookie', cookies)
        .expect(204)
    })
  })
})
