import { Meal } from '../models/meal'

// Get the longest sequence of meals in the diet
export function getLongestSequenceMealsInTheDiet(meals: Meal[]) {
  let longestSequence = 0
  let currentSequence = 0

  for (const meal of meals) {
    if (meal.inTheDiet) {
      currentSequence++
      longestSequence = Math.max(longestSequence, currentSequence)
    } else {
      currentSequence = 0
    }
  }

  return longestSequence
}
