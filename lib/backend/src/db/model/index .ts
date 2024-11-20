import connection from "../schema/connection";
import { createCustomer, getCustomers } from "./customer";

const create = async () => {
    console.log("create in model/customer");
    
    await createCustomer(connection);
}
const getAll = async () => {
    await getCustomers(connection);
}

export {
    create, getAll
}