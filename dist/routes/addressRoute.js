"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const auth_1 = __importDefault(require("../library/middlewares/auth"));
const router = express_1.default.Router();
router.get('/:userId', auth_1.default, addressController_1.getAddressByUserId);
router.post('/', auth_1.default, addressController_1.createAddress);
router.patch('/:userId', auth_1.default, addressController_1.updateAddress);
exports.default = router;
