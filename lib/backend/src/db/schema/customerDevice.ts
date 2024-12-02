import getConnection from "../connection";
import { Knex } from "knex"

const createCustomerDeviceSchema = async () => {
    console.log('create customerDevice schema');

    const knex = getConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("customerDevice");
        if (!tableExists) {
            console.log('Creating customerDevice table...');
            await knex.schema.withSchema("yaazoru").createTable("customerDevice", (table: Knex.TableBuilder) => {
                table.increments("customerDevice_id").primary();
                table.string("customer_id").notNullable();
                table.string("device_id").notNullable().unique();
            });
            console.log('CustomerDevice table created successfully.');
        }
        else {
            console.log("CustomerDevice table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('error creat schema customerDevice', err)
    }
}

export {
    createCustomerDeviceSchema,
};
