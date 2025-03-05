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
exports.deletePost = exports.createPost = exports.getUserPosts = void 0;
const utils_1 = require("../utils/utils");
const postModel_1 = __importDefault(require("../models/postModel"));
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        const posts = yield postModel_1.default.findAll();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err });
    }
});
exports.getUserPosts = getUserPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = utils_1.postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', error: error.details });
    }
    try {
        const newPost = yield postModel_1.default.create(value);
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create post', error: err });
    }
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield postModel_1.default.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        yield post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete post', error: err });
    }
});
exports.deletePost = deletePost;
