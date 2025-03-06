import express from 'express';
import { getAddressByUserId, createAddress, updateAddress } from '../controllers/addressController';
import auth from "../library/middlewares/auth"

const router = express.Router();

router.get('/:userId', auth, getAddressByUserId);
router.post('/', auth, createAddress);
router.patch('/:userId', auth,  updateAddress);

export default router;
