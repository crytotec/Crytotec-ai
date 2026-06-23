import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import { createToken } from "../utilis/Token-maniger.js";
import { Token_Name } from "../utilis/TokenName.js";
// Test Controller
export const AllUserController = (req, res, next) => {
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
// Signup Controller
export const signupcontroller = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });
        res.clearCookie(Token_Name, {
            path: '/',
            httpOnly: true,
            domain: 'localhost',
            signed: true
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        const createtoken = createToken(existingUser._id.toString(), existingUser.email, '7d');
        res.cookie(Token_Name, createtoken, {
            path: '/',
            expires,
            httpOnly: true,
            domain: 'localhost',
            signed: true
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
// Login Controller
export const logincontroller = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Password is incorrect",
            });
        }
        res.clearCookie(Token_Name, {
            path: '/',
            httpOnly: true,
            domain: 'localhost',
            signed: true
        });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        const createtoken = createToken(existingUser._id.toString(), existingUser.email, '7d');
        res.cookie(Token_Name, createtoken, {
            path: '/',
            expires,
            httpOnly: true,
            domain: 'localhost',
            signed: true
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
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
// Logout Controller
export const logoutcontroller = (req, res, next) => {
    return res.status(200).json({
        message: "Successfully logged out",
    });
};
//# sourceMappingURL=UserController.js.map