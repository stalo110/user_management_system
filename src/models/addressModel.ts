import { DataTypes, Model } from 'sequelize';
import db from "../config/database.config"

export interface AddressAttributes {
    id: string;
    userId: string;
    street: string;
    city: string;
}

class Address extends Model<AddressAttributes> {}

Address.init({
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    userId: { type: DataTypes.UUID, allowNull: false },
    street: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
}, { sequelize:db, modelName: 'Address' });


export default Address;
