import { createCustomerSchema } from "./customer"
import connection from "./connection";

const createSchema = () => {
    console.log("create schema");
    
    createCustomerSchema(connection);
}

export {
    createSchema,
}