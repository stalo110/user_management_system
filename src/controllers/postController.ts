import { Request, Response } from 'express';
import { postSchema, option } from '../utils/utils';
import { Post } from '../models';

import { v4 as uuidv4 } from "uuid"

export const getUserPosts = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
     res.status(400).json({ error: "Invalid User ID" });
     return;
    }


    try {
        const posts = await Post.findAll({
            where: { userId }
        });
        if(posts.length == 0){
         res.status(400).json({error: "No posts found for this user"})
        }
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err });
    }
};

export const createPost = async (req: Request, res: Response): Promise<void>  => {

    try {
        const { userId, title, body } = req.body;
        const iduuid = uuidv4();

        const validateResult = postSchema.validate(req.body, option);
                if(validateResult.error){
                    res.status(400).json({Error: validateResult.error.details[0].message})
                }

        const newPost = await Post.create({
            id: iduuid,
            userId,
            title,
            body
        });
        res.status(201).json({msg: "Post created successfully", newPost});
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
