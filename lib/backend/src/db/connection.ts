import knex, { Knex } from "knex";


let connection: Knex<any, unknown[]> | null = null;

function getDbConnection(): Knex<any, unknown[]> {
    if (connection == null) {
        connection = knex({
            client: 'pg',
            connection: {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT as string),
                user: process.env.DB_USER,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                ssl: false,
            },
            pool: { min: 0, max: 7 },
        });
    }
    return connection;
}


export default getDbConnection;