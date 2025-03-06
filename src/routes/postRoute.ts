import express from 'express';
import { getUserPosts, createPost, deletePost } from '../controllers/postController';

const router = express.Router();

router.get('/:userId', getUserPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);

export default router;
