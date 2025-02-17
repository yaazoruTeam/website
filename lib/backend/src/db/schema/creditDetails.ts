import getConnection from "../connection";
import { Knex } from "knex";

const createCreditDetailsSchema = async () => {
  console.log("create creditDetails schema");

  const knex = getConnection();
  try {
    const tableExists = await knex.schema
      .withSchema("yaazoru")
      .hasTable("creditDetails");
    if (!tableExists) {
      console.log("Creating creditDetails table...");
      await knex.schema
        .withSchema("yaazoru")
        .createTable("creditDetails", (table: Knex.TableBuilder) => {
          table.increments("credit_id").primary();
          table.string("customer_id").notNullable(); // האם יש צורך לעשות את זה unique
          table.string("token").notNullable(); // האם יש צורך לעשות את זה unique
          table.string("expiry_month").notNullable();
          table.string("expiry_year").notNullable();
          table.date("created_at").notNullable();
          table.date("update_at").notNullable();
          // האם צריך סטטוס בשביל מחיקה ומה קורה במחיקה
        });
      console.log("creditDetails table created successfully.");
    } else {
      console.log("creditDetails table already exists. Skipping creation.");
    }
  } catch (err) {
    console.error("error creat schema creditDetails", err);
  }
};

export { createCreditDetailsSchema };
