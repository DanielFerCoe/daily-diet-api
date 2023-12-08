import { knex } from '../../database'

interface UpdateUserPasswordProps {
  id: string
  height: number
  weight: number
}

export class UpdateUserWeightAndHeightService {
  async execute({ id, height, weight }: UpdateUserPasswordProps) {
    const user = await knex('users')
      .where({
        id,
      })
      .first()

    if (!user) throw new Error('User not found!')

    const userUpdated = await knex('users')
      .update({
        height,
        weight,
      })
      .where({
        id,
      })
      .returning(['id', 'name', 'email', 'weight', 'height', 'created_at'])

    return userUpdated
  }
}
