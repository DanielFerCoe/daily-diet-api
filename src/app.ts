import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import { mealsRoutes } from './meals/routes/meals'
import { usersRoutes } from './users/routes/users'
import { sessionsRoutes } from './users/routes/sessions'

import { errorHandler } from './middlewares/errorHandler'

export const app = fastify()

app.register(fastifyCookie)

app.setErrorHandler(errorHandler)

app.register(sessionsRoutes, {
  prefix: 'session',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
