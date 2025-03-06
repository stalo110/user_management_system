import { Request, Response } from 'express';
import { userSchema, option } from '../utils/utils';
import { User } from '../models';
import Address from '../models/addressModel';
import { v4 as uuidv4 } from "uuid"

export const getUsers = async (req: Request, res: Response) => {
    const pageNumber = parseInt(req.query.pageNumber as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    try {
        const { count, rows } = await User.findAndCountAll({
            offset: pageNumber * pageSize,
            limit: pageSize
        });

        res.json({ msg: "Fetch successful", total: count, users: rows });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
};

export const getUserCount = async (req: Request, res: Response) => {
    try {
        const count = await User.count();
        res.json({ msg: "User count Successful", total: count });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user count', error: err });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void>  => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            include: [{ model: Address }]
        });

        if (!user) {
             res.status(404).json({ message: 'User not found' });
             return;
        }

        res.json({msg: "User fetched successfully", user});
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user', error: err });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void>  => {
    try {
        const { name, email } = req.body;
        const iduuid = uuidv4();
    
        const validateResult = userSchema.validate(req.body, option);
        if(validateResult.error){
            res.status(400).json({Error: validateResult.error.details[0].message})
        }

        const newUser = await User.create({
            id: iduuid,
            name,
            email
        });
        res.status(201).json({msg: "User created successfully", newUser});
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err });
    }
};
