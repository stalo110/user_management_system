"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = exports.createAddress = exports.getAddressByUserId = void 0;
const utils_1 = require("../utils/utils");
const models_1 = require("../models");
const uuid_1 = require("uuid");
// GET /addresses/:userId
const getAddressByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const address = await models_1.Address.findOne({ where: { userId } });
        if (!address) {
            res.status(404).json({ message: 'Address not found for user' });
            return;
        }
        res.json({ msg: "Successfully found User address", address });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch Address', error: error });
    }
};
exports.getAddressByUserId = getAddressByUserId;
// POST /addresses - Create new address
const createAddress = async (req, res) => {
    const { userId, street, city } = req.body;
    try {
        const iduuid = (0, uuid_1.v4)();
        const validateResult = utils_1.addressSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        const existingAddress = await models_1.Address.findOne({ where: { userId: req.body.userId } });
        if (existingAddress) {
            res.status(400).json({ message: 'User already has an address' });
            return;
        }
        const address = await models_1.Address.create({
            id: iduuid,
            userId,
            street,
            city
        });
        res.status(201).json({ msg: "Address creation for user successful", address });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create Address', error: error });
    }
};
exports.createAddress = createAddress;
// PATCH /addresses/:userId - Update address
const updateAddress = async (req, res) => {
    const { userId } = req.params;
    try {
        const address = await models_1.Address.findOne({ where: { userId } });
        if (!address) {
            res.status(404).json({ message: 'Address not found for user' });
            return;
        }
        await address.update(req.body);
        res.json(address);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update Address', error: error });
    }
};
exports.updateAddress = updateAddress;
