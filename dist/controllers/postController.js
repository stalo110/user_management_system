"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getUserPosts = void 0;
const utils_1 = require("../utils/utils");
const postModel_1 = __importDefault(require("../models/postModel"));
const getUserPosts = async (req, res) => {
    const { userId } = req.query;
    try {
        const posts = await postModel_1.default.findAll();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err });
    }
};
exports.getUserPosts = getUserPosts;
const createPost = async (req, res) => {
    const { error, value } = utils_1.postSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: 'Validation error', error: error.details });
        return;
    }
    try {
        const newPost = await postModel_1.default.create(value);
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create post', error: err });
    }
};
exports.createPost = createPost;
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModel_1.default.findByPk(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete post', error: err });
    }
};
exports.deletePost = deletePost;
