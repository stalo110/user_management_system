import { Request, Response } from 'express';
import { addressSchema } from '../utils/utils';
import Address from '../models/addressModel';

// GET /addresses/:userId
export const getAddressByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const address = await Address.findOne({ where: { userId } });
    if (!address) {
        return res.status(404).json({ message: 'Address not found for user' });
    }

    res.json(address);
};

// POST /addresses - Create new address
export const createAddress = async (req: Request, res: Response) => {
    const { error } = addressSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingAddress = await Address.findOne({ where: { userId: req.body.userId } });
    if (existingAddress) {
        return res.status(400).json({ message: 'User already has an address' });
    }

    const address = await Address.create(req.body);
    res.status(201).json(address);
};

// PATCH /addresses/:userId - Update address
export const updateAddress = async (req: Request, res: Response) => {
    const { userId } = req.params;

    const address = await Address.findOne({ where: { userId } });
    if (!address) {
        return res.status(404).json({ message: 'Address not found for user' });
    }

    await address.update(req.body);
    res.json(address);
};
