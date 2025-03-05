import { Router } from 'express';
import { getUserPosts, createPost, deletePost } from '../controllers/postController';

const router = Router();

router.get('/', getUserPosts);
router.post('/', createPost);
router.delete('/:id', deletePost);

export default router;
