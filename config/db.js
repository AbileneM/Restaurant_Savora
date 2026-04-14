import { Sequelize } from "sequelize"
import dotenv from 'dotenv' //Importer les variables d'environnement

const ENV = dotenv.config().parsed //Récupérer les variables d'environnement
console.log(ENV)

const connection = new Sequelize(ENV.DB_NAME, ENV.DB_USER, ENV.DB_PASSWORD, {
    host: ENV.DB_HOST,
    dialect: ENV.DB_DIALECT
});

export default connection;