// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      height: number
      weight: number
      created_at: string
    }
    meals: {
      id: string
      name: string
      description: string
      date: Date
      inTheDiet: boolean
      user_id: string
      created_at: Date
    }
  }
}
