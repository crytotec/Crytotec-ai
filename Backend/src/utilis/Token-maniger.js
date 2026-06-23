"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenName_1 = require("./TokenName");
/**
 * CREATE TOKEN
 */
const createToken = (id, email, expiresIn) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in .env");
    }
    const payload = { id, email };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
};
exports.createToken = createToken;
/**
 * VERIFY TOKEN MIDDLEWARE (FIXED + SAFE)
 */
const verifyToken = (req, res, next) => {
    const token = req.cookies?.[TokenName_1.Token_Name] ||
        req.signedCookies?.[TokenName_1.Token_Name];
    if (!token) {
        return res.status(401).json({
            message: "Token not received",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ IMPORTANT: unify auth system
        req.user = {
            id: decoded.id,
            email: decoded.email,
        };
        return next();
    }
    catch (error) {
        console.log("❌ JWT ERROR:", error);
        return res.status(401).json({
            message: "Token expired or invalid",
        });
    }
};
exports.verifyToken = verifyToken;
