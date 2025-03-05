"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const userModel_1 = __importDefault(require("./userModel"));
class Address extends sequelize_1.Model {
}
Address.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    street: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: false },
}, { sequelize: database_config_1.default, modelName: 'Address' });
Address.belongsTo(userModel_1.default, { foreignKey: 'userId' });
userModel_1.default.hasOne(Address, { foreignKey: 'userId' });
exports.default = Address;
