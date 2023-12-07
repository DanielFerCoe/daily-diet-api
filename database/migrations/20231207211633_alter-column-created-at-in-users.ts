import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.text('created_at').defaultTo(knex.fn.now()).notNullable().alter()
  })
}
