import { Request, Response } from 'express';
import { addressSchema } from '../utils/utils';
import Address from '../models/addressModel';

// GET /addresses/:userId
export const getAddressByUserId = async (req: Request, res: Response): Promise<void>  => {
    const { userId } = req.params;

    const address = await Address.findOne({ where: { userId } });
    if (!address) {
     res.status(404).json({ message: 'Address not found for user' });
     return;
    }

    res.json(address);
};

// POST /addresses - Create new address
export const createAddress = async (req: Request, res: Response): Promise<void>  => {
    const { error } = addressSchema.validate(req.body);
    if (error) {
     res.status(400).json({ message: error.details[0].message });
     return;
    }

    const existingAddress = await Address.findOne({ where: { userId: req.body.userId } });
    if (existingAddress) {
     res.status(400).json({ message: 'User already has an address' });
     return;
    }

    const address = await Address.create(req.body);
    res.status(201).json(address);
};

// PATCH /addresses/:userId - Update address
export const updateAddress = async (req: Request, res: Response): Promise<void>  => {
    const { userId } = req.params;

    const address = await Address.findOne({ where: { userId } });
    if (!address) {
     res.status(404).json({ message: 'Address not found for user' });
     return;
    }

    await address.update(req.body);
    res.json(address);
};
