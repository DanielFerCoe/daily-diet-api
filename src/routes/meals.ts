import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const tables = await knex('sqlite_schema').select('*')

    return tables
  })
}
