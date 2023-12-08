import { knex } from '../../database'

interface ShowUserProps {
  id: string
}

export class ShowUserService {
  async execute({ id }: ShowUserProps) {
    const user = await knex('users')
      .where({
        id,
      })
      .first(['id', 'name', 'email', 'weight', 'height', 'created_at'])

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
}
