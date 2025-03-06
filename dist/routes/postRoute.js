"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const auth_1 = __importDefault(require("../library/middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/', auth_1.default, postController_1.getUserPosts);
router.post('/', auth_1.default, postController_1.createPost);
router.delete('/:id', auth_1.default, postController_1.deletePost);
exports.default = router;
