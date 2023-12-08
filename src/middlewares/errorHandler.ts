import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  response: FastifyReply,
) {
  if (error instanceof z.ZodError) {
    const erroPersonalizado = {
      error: 'Bad Request',
      details: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    }
    response.code(400).send(erroPersonalizado)
  } else if (error instanceof Error) {
    response.status(400).send({ error: 'Bad Request', message: error.message })
  } else {
    response.send(error)
  }
}
