import { knex } from '../../database'

interface UpdateUserProps {
  id: string
  name: string
  email: string
}

export class UpdateUserService {
  async execute({ id, email, name }: UpdateUserProps) {
    const user = await knex('users')
      .where({
        id,
      })
      .first()

    const existsUserWithEmail = await knex('users')
      .where({
        email,
      })
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    if (existsUserWithEmail && user.email !== email) {
      throw new Error('Email already exists')
    }

    const [userUpdated] = await knex('users')
      .update({
        name,
        email,
      })
      .where({
        id,
      })
      .returning(['id', 'name', 'email', 'weight', 'height', 'created_at'])

    return userUpdated
  }
}
