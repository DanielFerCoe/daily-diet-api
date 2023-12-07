import crypto from 'node:crypto'
import { knex } from '../../database'

interface CreateMealProps {
  name: string
  description: string
  date: Date
  inTheDiet: boolean
  userId?: string
}

export class CreateMealService {
  async execute({
    name,
    description,
    date,
    inTheDiet,
    userId,
  }: CreateMealProps) {
    const mealExists = await knex('meals')
      .where({
        name,
        description,
        date,
        inTheDiet,
      })
      .first()

    if (mealExists) {
      throw new Error('Meal already exists')
    }

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      date,
      inTheDiet,
      user_id: userId,
    })
  }
}
