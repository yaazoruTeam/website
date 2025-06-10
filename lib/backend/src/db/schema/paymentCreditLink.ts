import getDbConnection from "../connection";
import { Knex } from "knex"

const createPaymentCreditLink = async () => {
    console.log('create paymentCreditLink schema');

    const knex = getDbConnection();
    try {
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("paymentCreditLink");
        if (!tableExists) {
            console.log('Creating paymentCreditLink table...');
            await knex.schema.withSchema("yaazoru").createTable("paymentCreditLink", (table: Knex.TableBuilder) => {
                table.increments("paymentCreditLink_id").primary();
                table.string("monthlyPayment_id").notNullable();
                table.string("creditDetails_id").notNullable();
                table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
            });
            console.log('paymentCreditLink table created successfully.');
        }
        else {
            console.log("paymentCreditLink table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('error creat schema paymentCreditLink', err)
    }
}

export { createPaymentCreditLink };
