import { compare } from 'bcrypt'
import { FastifyReply } from 'fastify'
import { knex } from '../../database'

interface CreateSessionProps {
  email: string
  password: string
  response: FastifyReply
}

export class CreateSessionService {
  async execute({ email, password, response }: CreateSessionProps) {
    const user = await knex('users')
      .where({
        email,
      })
      .first()

    if (!user) {
      throw new Error('Incorrect email/password combination')
    }

    const passwordConfirmed = await compare(password, user.password)

    if (!passwordConfirmed) {
      throw new Error('Incorrect email/password combination')
    }

    response.cookie('userId', user.id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    })
  }
}
