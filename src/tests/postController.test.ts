import { Request, Response } from 'express';
import { getUserPosts, createPost, deletePost } from '../controllers/postController';
import Post from '../models/postModel';
import { postSchema } from '../utils/utils';

// Mock Sequelize Model and Validation Schema
jest.mock('../models/postModel');
jest.mock('../utils/utils', () => ({
    postSchema: {
        validate: jest.fn()
    }
}));

describe('Post Controller', () => {
    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnThis();
        res.json = jest.fn();
        return res;
    };

    describe('getUserPosts', () => {
        it('should fetch all posts', async () => {
            const req = { query: { userId: '1' } } as unknown as Request;
            const res = mockResponse();

            const mockPosts = [
                { id: 1, title: 'Post 1', content: 'Content 1', userId: 1 },
                { id: 2, title: 'Post 2', content: 'Content 2', userId: 1 }
            ];

            (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

            await getUserPosts(req, res);

            expect(Post.findAll).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockPosts);
        });

        it('should return 500 on error', async () => {
            const req = { query: { userId: '1' } } as unknown as Request;
            const res = mockResponse();

            (Post.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getUserPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to fetch posts',
                error: expect.any(Error)
            });
        });
    });

    describe('createPost', () => {
        it('should create post if valid', async () => {
            const req = {
                body: { title: 'New Post', content: 'This is a new post', userId: 1 }
            } as Request;
            const res = mockResponse();

            (postSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });

            const mockPost = { id: 1, ...req.body };
            (Post.create as jest.Mock).mockResolvedValue(mockPost);

            await createPost(req, res);

            expect(postSchema.validate).toHaveBeenCalledWith(req.body);
            expect(Post.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockPost);
        });

        it('should return 400 if validation fails', async () => {
            const req = {
                body: { title: '', content: 'This is a new post', userId: 1 }
            } as Request;
            const res = mockResponse();

            (postSchema.validate as jest.Mock).mockReturnValue({
                error: { details: [{ message: 'Title is required' }] }
            });

            await createPost(req, res);

            expect(postSchema.validate).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Validation error',
                error: [{ message: 'Title is required' }]
            });
        });

        it('should return 500 if Post creation fails', async () => {
            const req = {
                body: { title: 'New Post', content: 'This is a new post', userId: 1 }
            } as Request;
            const res = mockResponse();

            (postSchema.validate as jest.Mock).mockReturnValue({ error: null, value: req.body });

            (Post.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to create post',
                error: expect.any(Error)
            });
        });
    });

    describe('deletePost', () => {
        it('should delete post if found', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            const mockPost = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(undefined)
            };

            (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);

            await deletePost(req, res);

            expect(Post.findByPk).toHaveBeenCalledWith('1');
            expect(mockPost.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
        });

        it('should return 404 if post not found', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            (Post.findByPk as jest.Mock).mockResolvedValue(null);

            await deletePost(req, res);

            expect(Post.findByPk).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });

        it('should return 500 if deletion fails', async () => {
            const req = { params: { id: '1' } } as unknown as Request;
            const res = mockResponse();

            (Post.findByPk as jest.Mock).mockRejectedValue(new Error('Database error'));

            await deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to delete post',
                error: expect.any(Error)
            });
        });
    });
});
