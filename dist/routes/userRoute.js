"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = __importDefault(require("../library/middlewares/auth"));
const router = express_1.default.Router();
router.get('/', auth_1.default, userController_1.getUsers);
router.get('/count', auth_1.default, userController_1.getUserCount);
router.get('/:id', auth_1.default, userController_1.getUserById);
router.post('/', userController_1.createUser);
exports.default = router;
