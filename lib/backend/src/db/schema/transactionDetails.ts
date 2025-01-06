import getConnection from "../connection";
import { Knex } from "knex";

const createTransactionDetailsSchema = async () => {
  console.log("create transactionDetails schema");

  const knex = getConnection();
  try {
    const tableExists = await knex.schema
      .withSchema("yaazoru")
      .hasTable("transactionDetails");
    if (!tableExists) {
      console.log("Creating transactionDetails table...");
      await knex.schema
        .withSchema("yaazoru")
        .createTable("transactionDetails", (table: Knex.TableBuilder) => {
          table.increments("transaction_id").primary();
          table.string("credit_id").notNullable();
          table.integer("monthlyAmount").notNullable();
          table.integer("totalAmount").notNullable();
          table.date("nextBillingDate").notNullable();
          table.date("lastBillingDate").notNullable();
          table.boolean("isActive").notNullable();
        });
      console.log("transactionDetails table created successfully.");
    } else {
      console.log(
        "transactionDetails table already exists. Skipping creation."
      );
    }
  } catch (err) {
    console.error("error creat schema transactionDetails", err);
  }
};

export { createTransactionDetailsSchema };
