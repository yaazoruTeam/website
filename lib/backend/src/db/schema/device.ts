import getConnection from "../connection";
import { Knex } from "knex"

const createDeviceSchema = async () => {
    console.log('create device schema');

    const knex = getConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("devices");
        if (!tableExists) {
            console.log('Creating devices table...');
            await knex.schema.withSchema("yaazoru").createTable("devices", (table: Knex.TableBuilder) => {
                table.increments("device_id").primary();
                table.integer("SIM_number").notNullable().unique();
                table.integer("IMEI_1").notNullable().unique();
                table.integer("mehalcha_number").notNullable().unique();
                table.string("model").notNullable();
            });
            console.log('Device table created successfully.');


        }
        else {
            console.log("device table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('error creat schema device', err)
    }
}

export {
    createDeviceSchema,
};
