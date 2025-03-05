import { DataTypes, Model } from "sequelize";
import db from "../config/database.config"

export interface UserAttributes {
    id: string;
    name: string;
    email: string;

}

class User extends Model<UserAttributes> {}

User.init({
    id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize: db, modelName: 'User' });

export default User;