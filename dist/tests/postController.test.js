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
const postController_1 = require("../controllers/postController");
const postModel_1 = __importDefault(require("../models/postModel"));
const utils_1 = require("../utils/utils");
// Mock Sequelize Model and Validation Schema
jest.mock('../models/postModel');
jest.mock('../utils/utils', () => ({
    postSchema: {
        validate: jest.fn()
    }
}));
describe('Post Controller', () => {
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };
    describe('getUserPosts', () => {
        it('should fetch all posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: { userId: '1' } };
            const res = mockResponse();
            const mockPosts = [
                { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 },
                { id: 2, title: 'Post 2', content: 'Content 2', userId: 1 }
            ];
            postModel_1.default.findAll.mockResolvedValue(mockPosts);
            yield (0, postController_1.getUserPosts)(req, res);
            expect(postModel_1.default.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        }));
        it('should return 500 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { query: { userId: '1' } };
            const res = mockResponse();
            postModel_1.default.findAll.mockRejectedValue(new Error('Database error'));
            yield (0, postController_1.getUserPosts)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch posts',
                error: expect.any(Error)
            });
        }));
    });
    describe('createPost', () => {
        it('should create post if valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { title: 'New Post', content: 'This is a new post', userId: 1 }
            };
            const res = mockResponse();
            utils_1.postSchema.validate.mockReturnValue({ error: null, value: req.body });
            const mockPost = Object.assign({ id: 1 }, req.body);
            postModel_1.default.create.mockResolvedValue(mockPost);
            yield (0, postController_1.createPost)(req, res);
            expect(utils_1.postSchema.validate).toHaveBeenCalledWith(req.body);
            expect(postModel_1.default.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        }));
        it('should return 400 if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { title: '', content: 'This is a new post', userId: 1 }
            };
            const res = mockResponse();
            utils_1.postSchema.validate.mockReturnValue({
                error: { details: [{ message: 'Title is required' }] }
            });
            yield (0, postController_1.createPost)(req, res);
            expect(utils_1.postSchema.validate).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation error',
                error: [{ message: 'Title is required' }]
            });
        }));
        it('should return 500 if Post creation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { title: 'New Post', content: 'This is a new post', userId: 1 }
            };
            const res = mockResponse();
            utils_1.postSchema.validate.mockReturnValue({ error: null, value: req.body });
            postModel_1.default.create.mockRejectedValue(new Error('Database error'));
            yield (0, postController_1.createPost)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to create post',
                error: expect.any(Error)
            });
        }));
    });
    describe('deletePost', () => {
        it('should delete post if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            const mockPost = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(undefined)
            };
            postModel_1.default.findByPk.mockResolvedValue(mockPost);
            yield (0, postController_1.deletePost)(req, res);
            expect(postModel_1.default.findByPk).toHaveBeenCalledWith('1');
            expect(mockPost.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
        }));
        it('should return 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            postModel_1.default.findByPk.mockResolvedValue(null);
            yield (0, postController_1.deletePost)(req, res);
            expect(postModel_1.default.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
        }));
        it('should return 500 if deletion fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '1' } };
            const res = mockResponse();
            postModel_1.default.findByPk.mockRejectedValue(new Error('Database error'));
            yield (0, postController_1.deletePost)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to delete post',
                error: expect.any(Error)
            });
        }));
    });
});
