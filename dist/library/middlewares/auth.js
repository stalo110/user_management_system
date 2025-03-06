"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const jwtsecret = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ message: "Kindly sign in as a user" });
            return;
        }
        const token = authorization.slice(7, authorization.length);
        let verify = jsonwebtoken_1.default.verify(token, jwtsecret);
        if (!verify) {
            res.status(400).json({
                message: "Invalid token",
            });
            return;
        }
        const { id } = verify;
        const user = await userModel_1.default.findOne({ where: { id } });
        if (!user) {
            res.status(400).json({
                message: "Unauthorized!, kindly sign in as a user",
            });
            return;
        }
        req.user = verify;
        next();
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = auth;
