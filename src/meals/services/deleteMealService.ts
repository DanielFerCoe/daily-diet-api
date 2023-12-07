import { knex } from '../../database'

interface DeleteMealProps {
  id: string
  userId?: string
}

export class DeleteMealService {
  async execute({ id, userId }: DeleteMealProps) {
    const mealExists = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (!mealExists) {
      throw new Error('Meal not found!')
    }

    await knex('meals').delete().where({ id })
  }
}
