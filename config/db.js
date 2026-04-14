import { Sequelize } from "sequelize"
import dotenv from 'dotenv' //Importer les variables d'environnement

const ENV = dotenv.config().parsed //Récupérer les variables d'environnement

const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: ENV.DB_DIALECT
    }
);

export default connection;