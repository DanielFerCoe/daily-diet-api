import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '../src/app'
import { createMealMock } from './mocks/createMealMock'
import { createUserMock } from './mocks/createUserMock'
import { User } from '../src/users/models/user'
import { Meal } from '../src/meals/models/meal'

describe('Meals routes', () => {
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

  describe('Create meal', async () => {
    const { name, email, height, password, weight } = createUserMock

    let userCreated: User = {} as User

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

    it('should not be able to create a new meal without cookie userId', async () => {
      const { name, date, description, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          name,
          date,
          description,
          inTheDiet,
          userId: userCreated.id,
        })
        .expect(401)
    })

    it('should not be able to create a new meal without name', async () => {
      const { date, description, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          date,
          description,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to create a new meal without description', async () => {
      const { date, name, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          date,
          name,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to create a new meal without date', async () => {
      const { description, name, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to create a new meal without inTheDiet', async () => {
      const { description, name, date } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to create a new meal  without userId', async () => {
      const { description, name, date, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          inTheDiet,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to create a new meal if meal already exists', async () => {
      const { description, name, date, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          inTheDiet: !!inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          inTheDiet: !!inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to create a new meal', async () => {
      const { description, name, date, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          inTheDiet: !!inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(201)
    })
  })

  describe('List meal', async () => {
    const mealMock = createMealMock[0]

    let userCreated: User = {} as User

    let cookies: string[] = []

    beforeEach(async () => {
      const { name, email, height, password, weight } = createUserMock

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

    it('should not be able to list meals without cookie userId', async () => {
      await request(app.server).get('/meals').expect(401)
    })

    it('should not be able to list meals by another user', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name,
        description,
        date,
        inTheDiet: !!inTheDiet,
      })

      /* Create Another User */
      const responseCreateUser = await request(app.server).post('/users').send({
        name: createUserMock.name,
        email: 'anotherUser@email.com',
        password: createUserMock.password,
        height: createUserMock.height,
        weight: createUserMock.weight,
      })

      const anotherUser: User = responseCreateUser.body.user[0]

      /* Create Session */
      const createSessionResponse = await request(app.server)
        .post('/session')
        .send({
          email: anotherUser.email,
          password: createUserMock.password,
        })

      const cookiesAnotherUser = createSessionResponse.get('Set-Cookie')

      console.log('create', cookiesAnotherUser)

      /* List Meal */
      const responseListMeals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookiesAnotherUser)
        .expect(200)

      expect(responseListMeals.body.meals).toEqual([])
    })

    it('should be able to list meals', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name,
        description,
        date,
        inTheDiet: !!inTheDiet,
      })

      /* LIst Meal */
      const responseListMeals = await request(app.server)
        .get('/meals')
        .set('Cookie', cookies)
        .expect(200)

      expect(responseListMeals.body.meals[0]).toEqual(
        expect.objectContaining({
          name,
          date: new Date(date).toISOString(),
          description,
          inTheDiet,
        }),
      )
    })
  })

  describe('Show meal', async () => {
    const mealMock = createMealMock[0]

    let userCreated: User = {} as User

    let cookies: string[] = []

    beforeEach(async () => {
      const { name, email, height, password, weight } = createUserMock

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

    it('should not be able to show meal without cookie userId', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      const responseCreateMeal = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name,
          description,
          date,
          inTheDiet: !!inTheDiet,
        })

      /* Get Meal */
      await request(app.server)
        .get(`/meals/${responseCreateMeal.body.meal.id}`)
        .expect(401)
    })

    it('should not be able to show meal if meal doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .get(`/meals/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to show meals', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      const responseCreateMeal = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name,
          description,
          date,
          inTheDiet: !!inTheDiet,
        })

      /* Show Meal */
      const responseListMeals = await request(app.server)
        .get(`/meals/${responseCreateMeal.body.meal.id}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(responseListMeals.body.meal).toEqual(
        expect.objectContaining({
          name,
          date: new Date(date).toISOString(),
          description,
          inTheDiet,
        }),
      )
    })
  })

  describe('Delete meal', async () => {
    const mealMock = createMealMock[0]

    let userCreated: User = {} as User

    let cookies: string[] = []

    beforeEach(async () => {
      const { name, email, height, password, weight } = createUserMock

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

    it('should not be able to delete meal without cookie userId', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      const responseCreateMeal = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name,
          description,
          date,
          inTheDiet: !!inTheDiet,
        })

      /* Delete Meal */
      await request(app.server)
        .delete(`/meals/${responseCreateMeal.body.meal.id}`)
        .expect(401)
    })

    it('should not be able to delete meal if meal doesnt exist', async () => {
      const wrongId = '202f8c1b-8eee-44eb-a7df-bfbc26c7b691'

      await request(app.server)
        .delete(`/meals/${wrongId}`)
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to delete meal', async () => {
      const { name, date, description, inTheDiet } = mealMock

      /* Create Meal */
      const responseCreateMeal = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name,
          description,
          date,
          inTheDiet: !!inTheDiet,
        })

      /* Delete Meal */
      await request(app.server)
        .delete(`/meals/${responseCreateMeal.body.meal.id}`)
        .set('Cookie', cookies)
        .expect(204)
    })
  })

  describe('Update meal', async () => {
    const { name, email, height, password, weight } = createUserMock

    let userCreated: User = {} as User
    let mealCreated: Meal = {} as Meal

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

      /* Create Meal */
      const mealMock = createMealMock[0]

      const responseCreateMeal = await request(app.server)
        .post('/meals')
        .set('Cookie', cookies)
        .send({
          name: mealMock.name,
          description: mealMock.description,
          date: mealMock.date,
          inTheDiet: !!mealMock.inTheDiet,
        })

      mealCreated = responseCreateMeal.body.meal
    })

    it('should not be able to update a meal without cookie userId', async () => {
      const { name, date, description, inTheDiet } = createMealMock[0]

      await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          name,
          date,
          description,
          inTheDiet,
          userId: userCreated.id,
        })
        .expect(401)
    })

    it('should not be able to update a meal without name', async () => {
      const { date, description, inTheDiet } = createMealMock[0]

      await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          date,
          description,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to update a meal without description', async () => {
      const { date, name, inTheDiet } = createMealMock[0]

      await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          date,
          name,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to update a meal without date', async () => {
      const { description, name, inTheDiet } = createMealMock[0]

      await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          description,
          name,
          inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to update a meal without inTheDiet', async () => {
      const { description, name, date } = createMealMock[0]

      await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          description,
          name,
          date,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should not be able to update a meal without userId', async () => {
      const { description, name, date, inTheDiet } = createMealMock[0]

      await request(app.server)
        .post('/meals')
        .send({
          description,
          name,
          date,
          inTheDiet,
        })
        .set('Cookie', cookies)
        .expect(400)
    })

    it('should be able to update a meal', async () => {
      const { description, name, date, inTheDiet } = createMealMock[1]

      const responseUpdateMeal = await request(app.server)
        .put(`/meals/${mealCreated.id}`)
        .send({
          description,
          name,
          date,
          inTheDiet: !!inTheDiet,
          userId: userCreated.id,
        })
        .set('Cookie', cookies)
        .expect(200)

      expect(responseUpdateMeal.body.meal).toEqual(
        expect.objectContaining({
          name,
          date: new Date(date).toISOString(),
          description,
          inTheDiet,
        }),
      )
    })
  })
})
