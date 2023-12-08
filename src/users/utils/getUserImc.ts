import { User } from '../models/user'

export function categoryIMC(imc: number) {
  const categories: Record<string, boolean> = {
    Underweight: imc < 18.5,
    'Normal weight': imc >= 18.5 && imc <= 24.9,
    Overweight: imc >= 25 && imc <= 29.9,
    'Obesity Class I': imc >= 30 && imc <= 34.9,
    'Obesity Class II': imc >= 35 && imc <= 39.9,
    'Obesity Class III (Morbid Obesity)': imc >= 40,
  }

  return (
    Object.keys(categories).find((key) => categories[key]) || 'Out of Range'
  )
}

export function getUserImc(user?: User) {
  if (user) {
    const imc = user.weight / Math.pow(user.height, 2)

    const imcFormated = Number(imc.toFixed(2))

    return {
      number: imcFormated,
      category: categoryIMC(imcFormated),
    }
  }
}
