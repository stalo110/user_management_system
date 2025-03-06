"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.get('/:userId', postController_1.getUserPosts);
router.post('/', postController_1.createPost);
router.delete('/:id', postController_1.deletePost);
exports.default = router;
