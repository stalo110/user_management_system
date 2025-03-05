import { Sequelize } from "sequelize";

const db = new Sequelize('index', '', '', {
    storage: 'database.sqlite',
    dialect: 'sqlite',
    logging: false
})
export default db