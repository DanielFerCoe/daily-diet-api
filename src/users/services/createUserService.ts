import crypto from 'node:crypto'
import { knex } from '../../database'
import { hash } from 'bcrypt'

interface CreateUserProps {
  name: string
  email: string
  password: string
  height: number
  weight: number
}

export class CreateUserService {
  async execute({ email, height, name, password, weight }: CreateUserProps) {
    const user = await knex('users')
      .where({
        email,
      })
      .first()

    if (user) {
      throw new Error('Email already exists')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      height,
      weight,
    })
  }
}
