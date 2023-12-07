import { FastifyInstance } from 'fastify'
import { UsersController } from '../controllers/usersController'
import { checkUserIdExists } from '../../middlewares/checkUserIdExists'

export async function usersRoutes(app: FastifyInstance) {
  const userController = new UsersController()

  app.post('/', userController.create)

  app.get('/', { preHandler: [checkUserIdExists] }, userController.index)

  app.get('/:id', { preHandler: [checkUserIdExists] }, userController.show)

  app.put('/:id', { preHandler: [checkUserIdExists] }, userController.update)

  app.patch(
    '/:id/password',
    { preHandler: [checkUserIdExists] },
    userController.updatePassword,
  )

  app.patch(
    '/:id/heightAndWeight',
    { preHandler: [checkUserIdExists] },
    userController.updateHeightAndWeight,
  )
}
