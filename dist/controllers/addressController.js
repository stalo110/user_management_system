"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = exports.createAddress = exports.getAddressByUserId = void 0;
const utils_1 = require("../utils/utils");
const addressModel_1 = __importDefault(require("../models/addressModel"));
// GET /addresses/:userId
const getAddressByUserId = async (req, res) => {
    const { userId } = req.params;
    const address = await addressModel_1.default.findOne({ where: { userId } });
    if (!address) {
        res.status(404).json({ message: 'Address not found for user' });
        return;
    }
    res.json(address);
};
exports.getAddressByUserId = getAddressByUserId;
// POST /addresses - Create new address
const createAddress = async (req, res) => {
    const { error } = utils_1.addressSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const existingAddress = await addressModel_1.default.findOne({ where: { userId: req.body.userId } });
    if (existingAddress) {
        res.status(400).json({ message: 'User already has an address' });
        return;
    }
    const address = await addressModel_1.default.create(req.body);
    res.status(201).json(address);
};
exports.createAddress = createAddress;
// PATCH /addresses/:userId - Update address
const updateAddress = async (req, res) => {
    const { userId } = req.params;
    const address = await addressModel_1.default.findOne({ where: { userId } });
    if (!address) {
        res.status(404).json({ message: 'Address not found for user' });
        return;
    }
    await address.update(req.body);
    res.json(address);
};
exports.updateAddress = updateAddress;
