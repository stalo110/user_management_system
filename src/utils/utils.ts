import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
});


export const addressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    userId: Joi.string().uuid().required()
});


export const postSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    title: Joi.string().required(),
    body: Joi.string().required()
});
