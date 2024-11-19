import { Knex } from "knex"

function createCostumerSchema(knex: Knex<any, unknown[]>) {
    knex.schema.withSchema("yaazoru").createTable()
}

export {
    createCostumerSchema
}