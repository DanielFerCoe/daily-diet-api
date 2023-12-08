import { knex } from '../../database'

export class ListUserService {
  async execute() {
    const users = await knex('users').select([
      'id',
      'name',
      'email',
      'weight',
      'height',
      'created_at',
    ])

    return users
  }
}
