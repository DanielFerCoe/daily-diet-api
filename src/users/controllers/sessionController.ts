import { DeleteSessionService } from './../services/deleteSessionService'
import { CreateSessionService } from './../services/createSessionService'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class SessionController {
  async create(request: FastifyRequest, response: FastifyReply) {
    const schemaBody = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const body = schemaBody.parse(request.body)

    const createSessionService = new CreateSessionService()

    await createSessionService.execute({ ...body, response })

    response.status(201).send()
  }

  async delete(request: FastifyRequest, response: FastifyReply) {
    const deleteSessionService = new DeleteSessionService()

    await deleteSessionService.execute({ response })

    response.status(204).send()
  }
}
