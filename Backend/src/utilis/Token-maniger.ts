import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Token_Name } from "./TokenName";

/**
 * JWT Payload Type (FIXED)
 */
interface UserPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * CREATE TOKEN
 */
export const createToken = (
  id: string,
  email: string,
  expiresIn: jwt.SignOptions["expiresIn"]
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  const payload = { id, email };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * VERIFY TOKEN MIDDLEWARE (FIXED + SAFE)
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.[Token_Name] ||
    req.signedCookies?.[Token_Name];

  if (!token) {
    return res.status(401).json({
      message: "Token not received",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserPayload;

    // ✅ IMPORTANT: unify auth system
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };



    return next();
  } catch (error) {
    console.log("❌ JWT ERROR:", error);

    return res.status(401).json({
      message: "Token expired or invalid",
    });
  }
};