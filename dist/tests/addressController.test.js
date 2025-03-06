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
const addressController_1 = require("../controllers/addressController");
const addressModel_1 = __importDefault(require("../models/addressModel"));
const utils_1 = require("../utils/utils");
// Mock Sequelize Model
jest.mock('../models/addressModel');
jest.mock('../utils/utils', () => ({
    addressSchema: {
        validate: jest.fn()
    }
}));
describe('Address Controller', () => {
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };
    describe('getAddressByUserId', () => {
        it('should return address if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { userId: '1' } };
            const res = mockResponse();
            const mockAddress = { id: 1, street: '123 Main St', userId: 1 };
            addressModel_1.default.findOne.mockResolvedValue(mockAddress);
            yield (0, addressController_1.getAddressByUserId)(req, res);
            expect(addressModel_1.default.findOne).toHaveBeenCalledWith({ where: { userId: '1' } });
            expect(res.json).toHaveBeenCalledWith(mockAddress);
        }));
        it('should return 404 if no address is found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { userId: '1' } };
            const res = mockResponse();
            addressModel_1.default.findOne.mockResolvedValue(null);
            yield (0, addressController_1.getAddressByUserId)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Address not found for user' });
        }));
    });
    describe('createAddress', () => {
        it('should create address if valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            };
            const res = mockResponse();
            utils_1.addressSchema.validate.mockReturnValue({ error: null });
            addressModel_1.default.findOne.mockResolvedValue(null);
            const mockCreatedAddress = { id: 1, street: '123 Main St', userId: 1 };
            addressModel_1.default.create.mockResolvedValue(mockCreatedAddress);
            yield (0, addressController_1.createAddress)(req, res);
            expect(utils_1.addressSchema.validate).toHaveBeenCalledWith(req.body);
            expect(addressModel_1.default.findOne).toHaveBeenCalledWith({ where: { userId: req.body.userId } });
            expect(addressModel_1.default.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedAddress);
        }));
        it('should return 400 if addressSchema validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            };
            const res = mockResponse();
            utils_1.addressSchema.validate.mockReturnValue({
                error: { details: [{ message: 'Invalid address' }] }
            });
            yield (0, addressController_1.createAddress)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid address' });
        }));
        it('should return 400 if user already has an address', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            };
            const res = mockResponse();
            utils_1.addressSchema.validate.mockReturnValue({ error: null });
            addressModel_1.default.findOne.mockResolvedValue({ id: 1 });
            yield (0, addressController_1.createAddress)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already has an address' });
        }));
    });
    describe('updateAddress', () => {
        it('should update address if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { userId: '1' },
                body: { street: '456 New St' }
            };
            const res = mockResponse();
            const mockAddress = {
                id: 1,
                street: '123 Main St',
                update: jest.fn().mockResolvedValue(undefined)
            };
            addressModel_1.default.findOne.mockResolvedValue(mockAddress);
            yield (0, addressController_1.updateAddress)(req, res);
            expect(addressModel_1.default.findOne).toHaveBeenCalledWith({ where: { userId: '1' } });
            expect(mockAddress.update).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockAddress);
        }));
        it('should return 404 if no address found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { userId: '1' } };
            const res = mockResponse();
            addressModel_1.default.findOne.mockResolvedValue(null);
            yield (0, addressController_1.updateAddress)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Address not found for user' });
        }));
    });
});
