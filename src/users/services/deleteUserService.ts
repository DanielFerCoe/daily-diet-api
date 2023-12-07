import { knex } from '../../database'

interface DeleteUserProps {
  id: string
}

export class DeleteUserService {
  async execute({ id }: DeleteUserProps) {
    const userExists = await knex('users')
      .where({
        id,
      })
      .first()

    if (!userExists) {
      throw new Error('User not found!')
    }

    await knex('users').delete().where({ id })
  }
}
