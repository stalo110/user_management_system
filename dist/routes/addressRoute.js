"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const router = (0, express_1.Router)();
router.get('/:userId', addressController_1.getAddressByUserId);
router.post('/', addressController_1.createAddress);
router.patch('/:userId', addressController_1.updateAddress);
exports.default = router;
