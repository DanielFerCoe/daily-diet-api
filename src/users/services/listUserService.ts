import { knex } from '../../database'

export class ListUserService {
  async execute() {
    const users = await knex('users').select()

    return users
  }
}
