import getConnection from "../connection";
import { Knex } from "knex"

const createCreditDetailsSchema = async () => {
    console.log('create creditDetails schema');

    const knex = getConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("creditDetails");
        if (!tableExists) {
            console.log('Creating creditDetails table...');
            await knex.schema.withSchema("yaazoru").createTable("creditDetails", (table: Knex.TableBuilder) => {
                table.increments("credit_id").primary();
                table.integer("client_id").notNullable();
                table.bigInteger("cc_token_id").notNullable();
            });
            console.log('creditDetails table created successfully.');
        }
        else {
            console.log("creditDetails table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('error creat schema creditDetails', err)
    }
}

export {
    createCreditDetailsSchema,
};
