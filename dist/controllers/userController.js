"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getUserCount = exports.getUsers = void 0;
const utils_1 = require("../utils/utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const addressModel_1 = __importDefault(require("../models/addressModel"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const { count, rows } = yield userModel_1.default.findAndCountAll({
            offset: pageNumber * pageSize,
            limit: pageSize
        });
        res.json({ total: count, users: rows });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
});
exports.getUsers = getUsers;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield userModel_1.default.count();
        res.json({ total: count });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user count', error: err });
    }
});
exports.getUserCount = getUserCount;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield userModel_1.default.findByPk(id, {
            include: [{ model: addressModel_1.default }]
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = utils_1.userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', error: error.details });
    }
    try {
        const newUser = yield userModel_1.default.create(value);
        res.status(201).json(newUser);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
});
exports.createUser = createUser;
