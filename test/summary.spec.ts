import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { createUserMock } from './mocks/createUserMock'
import { createMealMock } from './mocks/createMealMock'

describe('Summary route', () => {
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

  it('should be able to show the summary', async () => {
    /* Create User */
    await request(app.server).post('/users').send({
      name: createUserMock.name,
      email: createUserMock.email,
      password: createUserMock.password,
      height: createUserMock.height,
      weight: createUserMock.weight,
    })

    /* Create Session */
    const createSessionResponse = await request(app.server)
      .post('/session')
      .send({
        email: createUserMock.email,
        password: createUserMock.password,
      })

    const cookies = createSessionResponse.get('Set-Cookie')

    /* Create Meals */
    createMealMock.forEach(async (mealMock) => {
      await request(app.server).post('/meals').set('Cookie', cookies).send({
        name: mealMock.name,
        description: mealMock.description,
        date: mealMock.date,
        inTheDiet: !!mealMock.inTheDiet,
      })
    })

    const responseGetSummary = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(
      responseGetSummary.body.summary,
      expect.objectContaining({
        totalMeals: 3,
        totalMealsInTheDiet: 2,
        totalMealsNotInTheDiet: 1,
        longestSequenceInTheDiet: 2,
        imc: { imc: 27.34, category: 'Overweight' },
      }),
    )
  })

  it('should not be able to show the summary without cookie userId', async () => {
    await request(app.server).get('/meals/summary').expect(401)
  })
})
