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
      .first()

    return user
  }
}
