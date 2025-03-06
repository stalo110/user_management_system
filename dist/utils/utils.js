"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.option = exports.postSchema = exports.updateAddressSchema = exports.addressSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required()
});
exports.addressSchema = joi_1.default.object({
    street: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    userId: joi_1.default.string().uuid().required()
});
exports.updateAddressSchema = joi_1.default.object({
    street: joi_1.default.string().optional(),
    city: joi_1.default.string().optional(),
});
exports.postSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
    title: joi_1.default.string().required(),
    body: joi_1.default.string().required()
});
exports.option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
};
