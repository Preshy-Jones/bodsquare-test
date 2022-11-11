"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { login, register, handleRefreshToken, } = require("../../controllers/auth");
const router = express_1.default.Router();
router.post("/login", login);
router.get("/refresh", handleRefreshToken);
router.post("/register", register);
module.exports = router;
