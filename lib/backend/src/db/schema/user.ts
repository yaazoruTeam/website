import { User } from "@yaazoru/model";
import getConnection from "../connection";
import { Knex } from "knex"

const createUserSchema = async () => {
    console.log('create user schema');

    const knex = getConnection();
    try {
        const roles: Array<User.Model['role']> = ['admin', 'branch'];
        const tableExists = await knex.schema.withSchema("yaazoru").hasTable("users");
        if (!tableExists) {
            console.log('Creating user table...');
            await knex.schema.withSchema("yaazoru").createTable("users", (table: Knex.TableBuilder) => {
                table.increments("user_id").primary();
                table.string("first_name", 20).notNullable();
                table.string("last_name", 20).notNullable();
                table.string("id_number", 9).notNullable().unique();
                table.string("phone_number", 20).notNullable();
                table.string("additional_phone", 20).nullable();
                table.string("email", 50).notNullable().unique();
                table.string("city", 20).notNullable();
                table.string("address1").notNullable();
                table.string("address2").nullable();
                table.string("zipCode").notNullable();
                table.string("password").notNullable().unique();
                table.string("user_name").notNullable().unique();
                table.enu("role", roles).notNullable();
                table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
            });
            console.log('User table created successfully.');
        }
        else {
            console.log("User table already exists. Skipping creation.");
        }

    } catch (err) {
        console.error('error creat schema user', err)
    }
}

export {
    createUserSchema,
};
