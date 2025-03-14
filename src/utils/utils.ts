import { error } from 'console';
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
export const updateAddressSchema = Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
});


export const postSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    title: Joi.string().required(),
    body: Joi.string().required()
});


export const option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
};