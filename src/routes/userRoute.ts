import { Router } from 'express';
import { getUsers, getUserCount, getUserById, createUser } from '../controllers/userController';
import auth from "../library/middlewares/auth"

const router = Router();

router.get('/', auth, getUsers);
router.get('/count', auth, getUserCount);
router.get('/:id', auth, getUserById);
router.post('/', createUser);

export default router;
