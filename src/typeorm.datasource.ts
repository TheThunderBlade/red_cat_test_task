import { join } from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRESS_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRESS_PASSWORD),
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: ['migrations/*.ts'],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default AppDataSource;
