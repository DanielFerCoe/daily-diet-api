import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserIdExists(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userId = request.cookies.userId

  if (!userId) {
    return response.status(401).send({
      error: 'Unauthorized',
    })
  }
}
