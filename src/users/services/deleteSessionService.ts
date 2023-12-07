import { FastifyReply } from 'fastify'

interface RemoveSessionProps {
  response: FastifyReply
}

export class DeleteSessionService {
  async execute({ response }: RemoveSessionProps) {
    response.clearCookie('userId')
  }
}
