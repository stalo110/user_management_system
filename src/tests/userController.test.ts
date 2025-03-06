import { Request, Response } from 'express';
import { getUsers, getUserCount, getUserById, createUser } from '../controllers/userController';
import User from '../models/userModel';
import Address from '../models/addressModel';
import { userSchema } from '../utils/utils';

// Mock Sequelize Models
jest.mock('../models/userModel');
jest.mock('../models/addressModel');
jest.mock('../utils/utils', () => ({
    userSchema: {
        validate: jest.fn()
    }
}));

describe('User Controller', () => {

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };

    describe('getUsers', () => {
        it('should return paginated users', async () => {
            const req = { query: { pageNumber: '1', pageSize: '10' } } as unknown as Request;
            const res = mockResponse();

            const mockUsers = [{ id: 1, name: 'John Doe' }];
            (User.findAndCountAll as jest.Mock).mockResolvedValue({
                count: 1,
                rows: mockUsers
            });

            await getUsers(req, res);

            expect(User.findAndCountAll).toHaveBeenCalledWith({
                offset: 10,
                limit: 10
            });
            expect(res.json).toHaveBeenCalledWith({ total: 1, users: mockUsers });
        });

        it('should handle errors', async () => {
            const req = { query: {} } as unknown as Request;
            const res = mockResponse();

            (User.findAndCountAll as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch users',
                error: expect.any(Error)
            });
        });
    });

    describe('getUserCount', () => {
        it('should return user count', async () => {
            const req = {} as Request;
            const res = mockResponse();

            (User.count as jest.Mock).mockResolvedValue(5);

            await getUserCount(req, res);

            expect(User.count).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ total: 5 });
        });

        it('should handle errors', async () => {
            const req = {} as Request;
            const res = mockResponse();

            (User.count as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await getUserCount(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch user count',
                error: expect.any(Error)
            });
        });
    });

    describe('getUserById', () => {
        it('should return user with address if found', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            const mockUser = { id: 1, name: 'John Doe', address: { street: '123 Main St' } };
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

            await getUserById(req, res);

            expect(User.findByPk).toHaveBeenCalledWith('1', {
                include: [{ model: Address }]
            });
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user is not found', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            (User.findByPk as jest.Mock).mockResolvedValue(null);

            await getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            (User.findByPk as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch user',
                error: expect.any(Error)
            });
        });
    });

    describe('createUser', () => {
        it('should create user if data is valid', async () => {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com' }
            } as Request;
            const res = mockResponse();

            (userSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });

            const mockUser = { id: 1, ...req.body };
            (User.create as jest.Mock).mockResolvedValue(mockUser);

            await createUser(req, res);

            expect(userSchema.validate).toHaveBeenCalledWith(req.body);
            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 400 if validation fails', async () => {
            const req = {
                body: { name: '' }
            } as Request;
            const res = mockResponse();

            (userSchema.validate as jest.Mock).mockReturnValue({
                error: { details: [{ message: 'Name is required' }] }
            });

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation error',
                error: [{ message: 'Name is required' }]
            });
        });

        it('should handle errors during creation', async () => {
            const req = {
                body: { name: 'John Doe', email: 'john@example.com' }
            } as Request;
            const res = mockResponse();

            (userSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });

            (User.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to create user',
                error: expect.any(Error)
            });
        });
    });
});
