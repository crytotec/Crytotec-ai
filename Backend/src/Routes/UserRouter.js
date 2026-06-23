"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controllers/UserController");
const Validator_1 = require("../utilis/Validator");
const Token_maniger_1 = require("../utilis/Token-maniger");
exports.userRouter = express_1.default.Router();
exports.userRouter.post('/alluser', UserController_1.AllUserController);
exports.userRouter.post('/login', (0, Validator_1.validated)(Validator_1.loginValidation), UserController_1.logincontroller);
exports.userRouter.get('/auth-status', Token_maniger_1.verifyToken, UserController_1.verifyUser);
exports.userRouter.post('/signup', (0, Validator_1.validated)(Validator_1.Signupvalidate), UserController_1.signupcontroller);
exports.userRouter.post('/logout', UserController_1.logoutcontroller);
console.log("USER ROUTER LOADED");
