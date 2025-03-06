"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getUserPosts = void 0;
const utils_1 = require("../utils/utils");
const postModel_1 = __importDefault(require("../models/postModel"));
const uuid_1 = require("uuid");
const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({ error: "Invalid User ID" });
        return;
    }
    try {
        const posts = await postModel_1.default.findAll({
            where: { userId }
        });
        if (posts.length == 0) {
            res.status(400).json({ error: "No posts found for this user" });
        }
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err });
    }
};
exports.getUserPosts = getUserPosts;
const createPost = async (req, res) => {
    try {
        const { userId, title, body } = req.body;
        const iduuid = (0, uuid_1.v4)();
        const validateResult = utils_1.postSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            res.status(400).json({ Error: validateResult.error.details[0].message });
        }
        const newPost = await postModel_1.default.create({
            id: iduuid,
            userId,
            title,
            body
        });
        res.status(201).json({ msg: "Post created successfully", newPost });
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
