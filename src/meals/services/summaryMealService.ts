import { knex } from '../../database'
import { getUserImc } from '../../users/utils/getUserImc'
import { getLongestSequenceMealsInTheDiet } from '../utils/getLongestSequenceMealsInTheDiet'

interface SummaryMealProps {
  userId?: string
}

export class SummaryMealService {
  async execute({ userId }: SummaryMealProps) {
    const totalMealsResult = await knex('meals')
      .where('user_id', userId)
      .count('id', { as: 'totalMeals' })
      .first()

    const totalMealsInTheDietResult = await knex('meals')
      .where({ user_id: userId, inTheDiet: true })
      .count('inTheDiet', { as: 'totalMealsInTheDiet' })
      .first()

    const totalMealsNotInTheDietResult = await knex('meals')
      .where({ user_id: userId, inTheDiet: false })
      .count('inTheDiet', { as: 'totalMealsNotInTheDiet' })
      .first()

    const meals = await knex('meals').where('user_id', userId)

    const user = await knex('users').where('id', userId).first()

    const imc = getUserImc(user)

    const longestSequence = getLongestSequenceMealsInTheDiet(meals)

    return {
      totalMeals: totalMealsResult?.totalMeals,
      totalMealsInTheDiet: totalMealsInTheDietResult?.totalMealsInTheDiet,
      totalMealsNotInTheDiet:
        totalMealsNotInTheDietResult?.totalMealsNotInTheDiet,
      longestSequenceInTheDiet: longestSequence,
      imc: {
        imc: imc?.number,
        category: imc?.category,
      },
    }
  }
}
