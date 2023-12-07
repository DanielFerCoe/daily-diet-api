import { knex } from '../../database'
import { hash } from 'bcrypt'

interface UpdateUserPasswordProps {
  id: string
  password: string
}

export class UpdateUserPasswordService {
  async execute({ id, password }: UpdateUserPasswordProps) {
    const user = await knex('users')
      .where({
        id,
      })
      .first()

    if (!user) throw new Error('User not found!')

    const hashedPassword = await hash(password, 8)

    const userUpdated = await knex('users')
      .update({
        password: hashedPassword,
      })
      .where({
        id,
      })
      .returning('*')

    return userUpdated
  }
}
