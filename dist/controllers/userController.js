"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getUserCount = exports.getUsers = void 0;
const utils_1 = require("../utils/utils");
const models_1 = require("../models");
const addressModel_1 = __importDefault(require("../models/addressModel"));
const uuid_1 = require("uuid");
const getUsers = async (req, res) => {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const { count, rows } = await models_1.User.findAndCountAll({
            offset: pageNumber * pageSize,
            limit: pageSize
        });
        res.json({ msg: "Fetch successful", total: count, users: rows });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
};
exports.getUsers = getUsers;
const getUserCount = async (req, res) => {
    try {
        const count = await models_1.User.count();
        res.json({ msg: "User count Successful", total: count });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user count', error: err });
    }
};
exports.getUserCount = getUserCount;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await models_1.User.findByPk(id, {
            include: [{ model: addressModel_1.default }]
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ msg: "User fetched successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const iduuid = (0, uuid_1.v4)();
        const validateResult = utils_1.userSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        const newUser = await models_1.User.create({
            id: iduuid,
            name,
            email
        });
        res.status(201).json({ msg: "User created successfully", newUser });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};
exports.createUser = createUser;
