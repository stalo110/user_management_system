import { Router } from 'express';
import { getUsers, getUserCount, getUserById, createUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/count', getUserCount);
router.get('/:id', getUserById);
router.post('/', createUser);

export default router;
