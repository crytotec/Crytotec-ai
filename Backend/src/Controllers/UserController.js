"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutcontroller = exports.verifyUser = exports.logincontroller = exports.signupcontroller = exports.AllUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const Token_maniger_1 = require("../utilis/Token-maniger");
const TokenName_1 = require("../utilis/TokenName");
/**
 * TEST CONTROLLER
 */
const AllUserController = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required",
        });
    }
    return res.status(200).json({
        message: "Successful",
    });
};
exports.AllUserController = AllUserController;
/**
 * SIGNUP CONTROLLER
 */
const signupcontroller = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await userModel_1.default.create({
            name,
            email,
            password: hashPassword,
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        const token = (0, Token_maniger_1.createToken)(newUser._id.toString(), newUser.email, "7d");
        res.cookie(TokenName_1.Token_Name, token, {
            path: "/",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(201).json({
            message: "User successfully created",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
};
exports.signupcontroller = signupcontroller;
/**
 * LOGIN CONTROLLER
 */
const logincontroller = async (req, res) => {
    try {
        console.log("🔥 LOGIN CONTROLLER STARTED");
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }
        const existingUser = await userModel_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        if (!existingUser.password) {
            return res.status(500).json({
                message: "User data corrupted",
            });
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Wrong password",
            });
        }
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        const token = (0, Token_maniger_1.createToken)(existingUser._id.toString(), existingUser.email, "7d");
        res.cookie(TokenName_1.Token_Name, token, {
            path: "/",
            expires,
            httpOnly: true,
            signed: true,
        });
        console.log("TOKEN CREATED:", token);
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
            },
        });
    }
    catch (err) {
        console.log("🔥 LOGIN ERROR CAUGHT:", err);
        return res.status(500).json({
            message: "Server crashed",
        });
    }
};
exports.logincontroller = logincontroller;
/**
 * VERIFY USER (FIXED - NO res.locals BUG)
 */
const verifyUser = async (req, res) => {
    try {
        // ✅ FIX: ONLY USE req.user (NOT res.locals)
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: "user not authenticated",
            });
        }
        const user = await userModel_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: "user not found",
            });
        }
        return res.status(200).json({
            message: "User verified successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    }
    catch (err) {
        console.log("🔥 VERIFY ERROR:", err);
        return res.status(500).json({
            message: "Server crashed",
        });
    }
};
exports.verifyUser = verifyUser;
/**
 * LOGOUT CONTROLLER
 */
const logoutcontroller = (req, res, next) => {
    res.clearCookie(TokenName_1.Token_Name, {
        path: "/",
    });
    return res.status(200).json({
        message: "Successfully logged out",
    });
};
exports.logoutcontroller = logoutcontroller;
