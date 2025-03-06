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
const userController_1 = require("../controllers/userController");
const userModel_1 = __importDefault(require("../models/userModel"));
const addressModel_1 = __importDefault(require("../models/addressModel"));
const utils_1 = require("../utils/utils");
// Mock Sequelize Models
jest.mock('../models/userModel');
jest.mock('../models/addressModel');
jest.mock('../utils/utils', () => ({
    userSchema: {
        validate: jest.fn()
    }
}));
describe('User Controller', () => {
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };
    describe('getUsers', () => {
        it('should return paginated users', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: { pageNumber: '1', pageSize: '10' } };
            const res = mockResponse();
            const mockUsers = [{ id: 1, name: 'John Doe' }];
            userModel_1.default.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: mockUsers
            });
            yield (0, userController_1.getUsers)(req, res);
            expect(userModel_1.default.findAndCountAll).toHaveBeenCalledWith({
                offset: 10,
                limit: 10
            });
            expect(res.json).toHaveBeenCalledWith({ total: 1, users: mockUsers });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: {} };
            const res = mockResponse();
            userModel_1.default.findAndCountAll.mockRejectedValue(new Error('DB Error'));
            yield (0, userController_1.getUsers)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch users',
                error: expect.any(Error)
            });
        }));
    });
    describe('getUserCount', () => {
        it('should return user count', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = mockResponse();
            userModel_1.default.count.mockResolvedValue(5);
            yield (0, userController_1.getUserCount)(req, res);
            expect(userModel_1.default.count).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ total: 5 });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = mockResponse();
            userModel_1.default.count.mockRejectedValue(new Error('DB Error'));
            yield (0, userController_1.getUserCount)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch user count',
                error: expect.any(Error)
            });
        }));
    });
    describe('getUserById', () => {
        it('should return user with address if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            const mockUser = { id: 1, name: 'John Doe', address: { street: '123 Main St' } };
            userModel_1.default.findByPk.mockResolvedValue(mockUser);
            yield (0, userController_1.getUserById)(req, res);
            expect(userModel_1.default.findByPk).toHaveBeenCalledWith('1', {
                include: [{ model: addressModel_1.default }]
            });
            expect(res.json).toHaveBeenCalledWith(mockUser);
        }));
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            userModel_1.default.findByPk.mockResolvedValue(null);
            yield (0, userController_1.getUserById)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            userModel_1.default.findByPk.mockRejectedValue(new Error('DB Error'));
            yield (0, userController_1.getUserById)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch user',
                error: expect.any(Error)
            });
        }));
    });
    describe('createUser', () => {
        it('should create user if data is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com' }
            };
            const res = mockResponse();
            utils_1.userSchema.validate.mockReturnValue({ error: null, value: req.body });
            const mockUser = Object.assign({ id: 1 }, req.body);
            userModel_1.default.create.mockResolvedValue(mockUser);
            yield (0, userController_1.createUser)(req, res);
            expect(utils_1.userSchema.validate).toHaveBeenCalledWith(req.body);
            expect(userModel_1.default.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        }));
        it('should return 400 if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { name: '' }
            };
            const res = mockResponse();
            utils_1.userSchema.validate.mockReturnValue({
                error: { details: [{ message: 'Name is required' }] }
            });
            yield (0, userController_1.createUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation error',
                error: [{ message: 'Name is required' }]
            });
        }));
        it('should handle errors during creation', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com' }
            };
            const res = mockResponse();
            utils_1.userSchema.validate.mockReturnValue({ error: null, value: req.body });
            userModel_1.default.create.mockRejectedValue(new Error('DB Error'));
            yield (0, userController_1.createUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to create user',
                error: expect.any(Error)
            });
        }));
    });
});
