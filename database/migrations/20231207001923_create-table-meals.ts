import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('date').notNullable()
    table.tinyint('inTheDiet').notNullable().defaultTo(false)
    table.integer('user_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    table.foreign('user_id').references('users.id').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
