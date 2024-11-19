import { createCostumerSchema } from "./costumer"
import connection from "./connection";

function createSchema() {
    createCostumerSchema(connection);
}

export {
    createSchema,
}