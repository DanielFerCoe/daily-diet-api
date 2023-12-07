import { FastifyInstance } from 'fastify'

import { MealsController } from '../controllers/mealsController'
import { SummaryController } from './../controllers/summaryController'

import { checkUserIdExists } from '../../middlewares/checkUserIdExists'

export async function mealsRoutes(app: FastifyInstance) {
  const mealsController = new MealsController()
  const summaryController = new SummaryController()

  app.addHook('preHandler', checkUserIdExists)

  app.get('/', mealsController.index)

  app.get('/summary', summaryController.index)

  app.get('/:id', mealsController.show)

  app.post('/', mealsController.create)

  app.put('/:id', mealsController.update)

  app.delete('/:id', mealsController.delete)
}
