import { Sequelize,Options } from "sequelize";
import serverConfig from "../config/server.config";
const options: Options = {
    logging: serverConfig.NODE_ENV === 'development' ? console.log : false,
    dialect: 'postgres', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    host: serverConfig.DB_HOST,
    username: serverConfig.DB_USERNAME,
    password: serverConfig.DB_PASSWORD,
    port: serverConfig.DB_PORT,
    database: serverConfig.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
};

const config = {
    production:
        new Sequelize(
            serverConfig.DB_NAME,
            serverConfig.DB_USERNAME,
            serverConfig.DB_PASSWORD,
            options
        ),
    development:
        new Sequelize('mysql', 'mysql', 'password', {
            host: 'localhost',
            dialect:'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
        }),

    testing:
        new Sequelize('app', '', '', {
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: false,
        }),

}

//Check environment the env is set to and select the db to run 
const ENV = serverConfig.NODE_ENV ==='development'?'development':serverConfig.NODE_ENV ==='production'? 'production' : 'testing'
const db = config[ENV];

export default db;