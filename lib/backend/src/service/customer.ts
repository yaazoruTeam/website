import { create, getAll } from "../db/model/index "

const createCustomer = async () => {
    console.log("customer service");
    
    await create();
}
const getCustomers = async () => {
    return await getAll();
}

export {
    createCustomer, getCustomers
}