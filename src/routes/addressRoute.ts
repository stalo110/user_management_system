import express from 'express';
import { getAddressByUserId, createAddress, updateAddress } from '../controllers/addressController';

const router = express.Router();

router.get('/:userId', getAddressByUserId);
router.post('/', createAddress);
router.patch('/:userId',  updateAddress);

export default router;
