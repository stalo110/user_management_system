import { Request, Response } from 'express';
import { postSchema } from '../utils/utils';
import Post from '../models/postModel';

export const getUserPosts = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err });
    }
};

export const createPost = async (req: Request, res: Response): Promise<void>  => {
    const { error, value } = postSchema.validate(req.body);

    if (error) {
     res.status(400).json({ message: 'Validation error', error: error.details });
     return;
    }

    try {
        const newPost = await Post.create(value);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create post', error: err });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void>  => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
         res.status(404).json({ message: 'Post not found' });
         return;
        }

        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete post', error: err });
    }
};
