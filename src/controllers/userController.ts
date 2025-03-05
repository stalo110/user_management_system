import { Request, Response } from 'express';
import { userSchema } from '../utils/utils';
import User from '../models/userModel';
import Address from '../models/addressModel';

export const getUsers = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    try {
        const { count, rows } = await User.findAndCountAll({
            offset: pageNumber * pageSize,
            limit: pageSize
        });

        res.json({ total: count, users: rows });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
};

export const getUserCount = async (req: Request, res: Response) => {
    try {
        const count = await User.count();
        res.json({ total: count });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user count', error: err });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            include: [{ model: Address }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { error, value } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    try {
        const newUser = await User.create(value);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};
