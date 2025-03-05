"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.get('/', postController_1.getUserPosts);
router.post('/', postController_1.createPost);
router.delete('/:id', postController_1.deletePost);
exports.default = router;
