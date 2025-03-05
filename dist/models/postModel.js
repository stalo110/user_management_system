"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const userModel_1 = __importDefault(require("./userModel"));
class Post extends sequelize_1.Model {
}
Post.init({
    id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: sequelize_1.DataTypes.UUIDV4 },
    userId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    body: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
}, { sequelize: database_config_1.default, modelName: 'Post' });
Post.belongsTo(userModel_1.default, { foreignKey: 'userId' });
userModel_1.default.hasMany(Post, { foreignKey: 'userId' });
exports.default = Post;
