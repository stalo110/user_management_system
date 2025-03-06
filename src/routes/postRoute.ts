import express from 'express';
import { getUserPosts, createPost, deletePost } from '../controllers/postController';
import auth from "../library/middlewares/auth"

const router = express.Router();

router.get('/', auth, getUserPosts);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);

export default router;
