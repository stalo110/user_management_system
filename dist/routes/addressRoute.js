"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const router = express_1.default.Router();
router.get('/:userId', addressController_1.getAddressByUserId);
router.post('/', addressController_1.createAddress);
router.patch('/:userId', addressController_1.updateAddress);
exports.default = router;
