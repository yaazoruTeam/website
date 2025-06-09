import getConnection from "../connection";
import { Knex } from "knex"

const createNotesSchema = async () => {
    console.log('create notes schema');

    const knex = getConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("notes");
        if (!tableExists) {
            console.log('Creating notes table...');
            await knex.schema.withSchema("yaazoru").createTable("notes", (table: Knex.TableBuilder) => {
                table.increments("note_id").primary();
                table.string("entity_id").notNullable();
                table.enum('entity_type', ['customer', 'device', 'branch']).notNullable();
                table.text("content").notNullable();
                table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
            });
            console.log('Notes table created successfully.');
        }
        else {
            console.log("Notes table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('Error creating notes schema', err)
    }
}

export {
    createNotesSchema,
};