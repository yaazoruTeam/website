import { createCustomerSchema } from "./customer"

const createSchema = async() => {
    console.log("Creating schema...");
    try {
        await createCustomerSchema();
        console.log("Schema created successfully");
    } catch (err) {
        console.error("Error creating schema", err);
    }
}

export {
    createSchema,
}