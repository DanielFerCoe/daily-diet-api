import { knex } from '../../database'

interface UpdateMealProps {
  id: string
  userId?: string
  name: string
  description: string
  date: Date
  inTheDiet: boolean
}

export class UpdateMealService {
  async execute({
    id,
    userId,
    name,
    description,
    date,
    inTheDiet,
  }: UpdateMealProps) {
    const meal = await knex('meals')
      .where({
        id,
        user_id: userId,
      })
      .first()

    if (!meal) {
      throw new Error('Meal not found!')
    }

    const mealUpdated = await knex('meals')
      .update({
        name,
        description,
        date,
        inTheDiet,
      })
      .where({ id })
      .returning('*')

    return mealUpdated
  }
}
