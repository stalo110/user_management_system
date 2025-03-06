import { Request, Response } from 'express';
import { getAddressByUserId, createAddress, updateAddress } from '../controllers/addressController';
import Address from '../models/addressModel';
import { addressSchema } from '../utils/utils';

// Mock Sequelize Model
jest.mock('../models/addressModel');
jest.mock('../utils/utils', () => ({
    addressSchema: {
        validate: jest.fn()
    }
}));

describe('Address Controller', () => {

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };

    describe('getAddressByUserId', () => {
        it('should return address if found', async () => {
            const req = { params: { userId: '1' } } as unknown as Request;
            const res = mockResponse();

            const mockAddress = { id: 1, street: '123 Main St', userId: 1 };

            (Address.findOne as jest.Mock).mockResolvedValue(mockAddress);

            await getAddressByUserId(req, res);

            expect(Address.findOne).toHaveBeenCalledWith({ where: { userId: '1' } });
            expect(res.json).toHaveBeenCalledWith(mockAddress);
        });

        it('should return 404 if no address is found', async () => {
            const req = { params: { userId: '1' } } as unknown as Request;
            const res = mockResponse();

            (Address.findOne as jest.Mock).mockResolvedValue(null);

            await getAddressByUserId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Address not found for user' });
        });
    });

    describe('createAddress', () => {
        it('should create address if valid', async () => {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            } as Request;
            const res = mockResponse();

            (addressSchema.validate as jest.Mock).mockReturnValue({ error: null });
            (Address.findOne as jest.Mock).mockResolvedValue(null);
            const mockCreatedAddress = { id: 1, street: '123 Main St', userId: 1 };
            (Address.create as jest.Mock).mockResolvedValue(mockCreatedAddress);

            await createAddress(req, res);

            expect(addressSchema.validate).toHaveBeenCalledWith(req.body);
            expect(Address.findOne).toHaveBeenCalledWith({ where: { userId: req.body.userId } });
            expect(Address.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedAddress);
        });

        it('should return 400 if addressSchema validation fails', async () => {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            } as Request;
            const res = mockResponse();

            (addressSchema.validate as jest.Mock).mockReturnValue({
                error: { details: [{ message: 'Invalid address' }] }
            });

            await createAddress(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid address' });
        });

        it('should return 400 if user already has an address', async () => {
            const req = {
                body: { street: '123 Main St', userId: 1 }
            } as Request;
            const res = mockResponse();

            (addressSchema.validate as jest.Mock).mockReturnValue({ error: null });
            (Address.findOne as jest.Mock).mockResolvedValue({ id: 1 });

            await createAddress(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already has an address' });
        });
    });

    describe('updateAddress', () => {
        it('should update address if found', async () => {
            const req = {
                params: { userId: '1' },
                body: { street: '456 New St' }
            } as unknown as Request;
            const res = mockResponse();

            const mockAddress = {
                id: 1,
                street: '123 Main St',
                update: jest.fn().mockResolvedValue(undefined)
            };

            (Address.findOne as jest.Mock).mockResolvedValue(mockAddress);

            await updateAddress(req, res);

            expect(Address.findOne).toHaveBeenCalledWith({ where: { userId: '1' } });
            expect(mockAddress.update).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockAddress);
        });

        it('should return 404 if no address found', async () => {
            const req = { params: { userId: '1' } } as unknown as Request;
            const res = mockResponse();

            (Address.findOne as jest.Mock).mockResolvedValue(null);

            await updateAddress(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Address not found for user' });
        });
    });
});
