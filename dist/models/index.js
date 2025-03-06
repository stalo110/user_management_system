"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Address = exports.User = exports.setupAssociations = void 0;
const userModel_1 = __importDefault(require("./userModel"));
exports.User = userModel_1.default;
const addressModel_1 = __importDefault(require("./addressModel"));
exports.Address = addressModel_1.default;
const postModel_1 = __importDefault(require("./postModel"));
exports.Post = postModel_1.default;
const setupAssociations = () => {
    userModel_1.default.hasOne(addressModel_1.default, { foreignKey: 'userId' });
    addressModel_1.default.belongsTo(userModel_1.default, { foreignKey: 'userId' });
    userModel_1.default.hasMany(postModel_1.default, { foreignKey: 'userId' });
    postModel_1.default.belongsTo(userModel_1.default, { foreignKey: 'userId' });
};
exports.setupAssociations = setupAssociations;
