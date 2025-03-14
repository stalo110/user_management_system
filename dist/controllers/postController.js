"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getUserPosts = void 0;
const utils_1 = require("../utils/utils");
const models_1 = require("../models");
const uuid_1 = require("uuid");
const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({ error: "Invalid User ID" });
        return;
    }
    try {
        const posts = await models_1.Post.findAll({
            where: { userId }
        });
        if (posts.length == 0) {
            res.status(400).json({ error: "No posts found for this user" });
        }
        res.json({ msg: "Successfully fetched user posts", posts });
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
        const newPost = await models_1.Post.create({
            id: iduuid,
            userId,
            title,
            body
        });
        res.status(201).json({ msg: "Post created successfully", newPost });
    }
    catch (err) {
        console.error('Error creating post:', err); // Add this
        res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
};
exports.createPost = createPost;
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await models_1.Post.findByPk(id);
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
