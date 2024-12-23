import { createYaazoruSchema } from "./yaazoru"
import { createCustomerSchema } from "./customer"
import { createDeviceSchema } from "./device"
import { createCustomerDeviceSchema } from "./customerDevice"
import { createUserSchema } from "./user"



const createSchema = async () => {
    console.log("Creating schema...");
    try {
        await createYaazoruSchema();
        await createCustomerSchema();
        await createDeviceSchema();
        await createCustomerDeviceSchema();
        await createUserSchema();
        console.log("Schema created successfully");
    } catch (err) {
        console.error("Error creating schema", err);
    }
}

export {
    createSchema,
}