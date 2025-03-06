import { Request, Response } from 'express';
import { addressSchema, updateAddressSchema, option } from '../utils/utils';
import { Address } from '../models';
import { v4 as uuidv4 } from "uuid"


// GET /addresses/:userId
export const getAddressByUserId = async (req: Request, res: Response): Promise<void>  => {
    const { userId } = req.params;

 try{
    const address = await Address.findOne({ where: { userId } });
    if (!address) {
     res.status(404).json({ message: 'Address not found for user' });
     return;
    }

    res.json({msg: "Successfully found User address", address});
 }catch(error){
    res.status(500).json({ message: 'Failed to fetch Address', error: error });
 }
};

// POST /addresses - Create new address
export const createAddress = async (req: Request, res: Response): Promise<void>  => {
    const { userId, street, city } = req.body;
    try{
        const iduuid = uuidv4();

        const validateResult = addressSchema.validate(req.body, option);
        if(validateResult.error){
            res.status(400).json({Error: validateResult.error.details[0].message})
            return;
        }
    
        const existingAddress = await Address.findOne({ where: { userId: req.body.userId } });
        if (existingAddress) {
         res.status(400).json({ message: 'User already has an address' });
         return;
        }
    
        const address = await Address.create({
            id: iduuid,
            userId,
            street,
            city
        });
        res.status(201).json({msg: "Address creation for user successful", address});
    }catch(error){
        res.status(500).json({ message: 'Failed to create Address', error: error });
    }
};

// PATCH /addresses/:userId - Update address
export const updateAddress = async (req: Request, res: Response): Promise<void>  => {
    const { userId } = req.params;
    const {street, city} = req.body;
   
   try{
    const iduuid = uuidv4();

    const validateResult = updateAddressSchema.validate(req.body, option);
    if(validateResult.error){
        res.status(400).json({Error: validateResult.error.details[0].message})
    }

    const address = await Address.findOne({ where: { userId } });
    if (!address) {
     res.status(404).json({ message: 'Address not found for user' });
     return;
    }

   const updateAddress = await address.update({
        street,
        city
    });
    res.json({msg: "update Successful", updateAddress});
   }catch(error){
    res.status(500).json({ message: 'Failed to update Address', error: error });
   }
};
