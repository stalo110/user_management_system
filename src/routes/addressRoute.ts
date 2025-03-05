import { Router } from 'express';
import { getAddressByUserId, createAddress, updateAddress } from '../controllers/addressController';

const router = Router();

router.get('/:userId', getAddressByUserId);
router.post('/', createAddress);
router.patch('/:userId', updateAddress);

export default router;
