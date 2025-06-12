import getDbConnection from "../connection";
import { Knex } from "knex"

const createCustomerDeviceSchema = async () => {
    console.log('create customerDevice schema');

    const knex = getDbConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("customerDevice");
        if (!tableExists) {
            console.log('Creating customerDevice table...');
            await knex.schema.withSchema("yaazoru").createTable("customerDevice", (table: Knex.TableBuilder) => {
                table.increments("customerDevice_id").primary();
                table.string("customer_id").notNullable();
                table.string("device_id").notNullable().unique();
                table.date('receivedAt').nullable();
                table.date('planEndDate').nullable();
                table.enu('filterVersion', ['1.7', '1.8']).nullable();
                table.enu('deviceProgram', ['0', '2']).nullable();
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
