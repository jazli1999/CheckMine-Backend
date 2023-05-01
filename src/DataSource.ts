import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH,
  entities: ['src/entity/*.ts'],
});

export default AppDataSource;
