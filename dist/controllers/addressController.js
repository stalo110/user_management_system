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
exports.updateAddress = exports.createAddress = exports.getAddressByUserId = void 0;
const utils_1 = require("../utils/utils");
const addressModel_1 = __importDefault(require("../models/addressModel"));
// GET /addresses/:userId
const getAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const address = yield addressModel_1.default.findOne({ where: { userId } });
    if (!address) {
        res.status(404).json({ message: 'Address not found for user' });
        return;
    }
    res.json(address);
});
exports.getAddressByUserId = getAddressByUserId;
// POST /addresses - Create new address
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = utils_1.addressSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    const existingAddress = yield addressModel_1.default.findOne({ where: { userId: req.body.userId } });
    if (existingAddress) {
        res.status(400).json({ message: 'User already has an address' });
        return;
    }
    const address = yield addressModel_1.default.create(req.body);
    res.status(201).json(address);
});
exports.createAddress = createAddress;
// PATCH /addresses/:userId - Update address
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const address = yield addressModel_1.default.findOne({ where: { userId } });
    if (!address) {
        res.status(404).json({ message: 'Address not found for user' });
        return;
    }
    yield address.update(req.body);
    res.json(address);
});
exports.updateAddress = updateAddress;
