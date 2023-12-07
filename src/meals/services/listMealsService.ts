import { knex } from '../../database'

interface ListMealsServiceProps {
  userId?: string
}

export class ListMealsService {
  async execute({ userId }: ListMealsServiceProps) {
    const meals = await knex('meals').select().where({ user_id: userId })

    return meals
  }
}
