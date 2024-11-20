import { Knex } from "knex";

const createCustomer = async (knex: Knex<any, unknown[]>) => {
    console.log("creat customer with knex");
    
    await knex('customers')
        .insert({
            first_name: 'David',
            last_name: 'Cohen',
            id_number: '235698563',
            phone_number: '0569856247',
            additional_phone: '0549886685',
            email: 'D@example.com',
            city: 'Jerusalem',
            address1: 'Yafo 25',
            address2: 'jcds',
            zipCode: '475286',
        })
    // ignore only on email conflict and active is true.
    // .onConflict(knex.raw('(email) where active'))
    // .ignore();
    console.log("after create ustomer with knex");
    
}
const getCustomers = async (knex: Knex<any, unknown[]>) => {
    return await knex.select().table('customers');
}

export {
    createCustomer, getCustomers,
}