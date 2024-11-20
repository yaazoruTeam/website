import { Knex } from "knex";

const createCustomerSchema = (knex: Knex<any, unknown[]>) => {
    console.log("create customer schema");

    knex.schema.withSchema("yaazoru").createTable("customers", (table) => {
        table.increments("customer_id").primary();
        table.string("first_name", 20).notNullable();
        table.string("last_name", 20).notNullable();
        table.string("id_number", 9).notNullable().unique();
        table.string("phone_number", 20).notNullable();
        table.string("additional_phone", 20);
        table.string("email", 50).notNullable().unique();
        table.string("city", 20).notNullable();
        table.string("address1").notNullable();
        table.integer("address2").notNullable();
        table.integer("zipCode").notNullable();
        // table.text("customer_notes");
    });

    console.log("after create customer schema");

}

export {
    createCustomerSchema,
};
