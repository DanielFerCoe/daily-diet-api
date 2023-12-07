import { FastifyInstance } from 'fastify'
import { SessionController } from '../controllers/sessionController'

export async function sessionsRoutes(app: FastifyInstance) {
  const sessionController = new SessionController()

  app.post('/', sessionController.create)

  app.delete('/signOut', sessionController.delete)
}
