import { createYaazoruSchema } from "./yaazoru"
import { createCustomerSchema } from "./customer"
import { createDeviceSchema } from "./device"


const createSchema = async () => {
    console.log("Creating schema...");
    try {
        await createYaazoruSchema();
        await createCustomerSchema();
        await createDeviceSchema();
        console.log("Schema created successfully");
    } catch (err) {
        console.error("Error creating schema", err);
    }
}

export {
    createSchema,
}