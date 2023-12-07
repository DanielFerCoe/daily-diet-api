import { knex } from '../../database'

interface ShowMealProps {
  id: string
  userId?: string
}

export class ShowMealService {
  async execute({ id, userId }: ShowMealProps) {
    const mealExists = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (!mealExists) {
      throw new Error('Meal not found!')
    }

    const meal = await knex('meals').select().where({ id }).first()

    return meal
  }
}
