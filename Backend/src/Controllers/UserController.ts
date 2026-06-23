import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../Models/userModel";
import { createToken } from "../utilis/Token-maniger";
import { Token_Name } from "../utilis/TokenName";

/**
 * TEST CONTROLLER
 */
export const AllUserController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

/**
 * SIGNUP CONTROLLER
 */
export const signupcontroller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const token = createToken(
      newUser._id.toString(),
      newUser.email,
      "7d"
    );

    res.cookie(Token_Name, token, {
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
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * LOGIN CONTROLLER
 */
export const logincontroller = async (req: Request, res: Response) => {
  try {
    console.log("🔥 LOGIN CONTROLLER STARTED");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const existingUser = await User.findOne({ email });

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

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const token = createToken(
      existingUser._id.toString(),
      existingUser.email,
      "7d"
    );

    res.cookie(Token_Name, token, {
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
  } catch (err) {
    console.log("🔥 LOGIN ERROR CAUGHT:", err);

    return res.status(500).json({
      message: "Server crashed",
    });
  }
};

/**
 * VERIFY USER (FIXED - NO res.locals BUG)
 */
export const verifyUser = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: ONLY USE req.user (NOT res.locals)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "user not authenticated",
      });
    }

    const user = await User.findById(userId);

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
  } catch (err) {
    console.log("🔥 VERIFY ERROR:", err);

    return res.status(500).json({
      message: "Server crashed",
    });
  }
};

/**
 * LOGOUT CONTROLLER
 */
export const logoutcontroller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie(Token_Name, {
    path: "/",
  });

  return res.status(200).json({
    message: "Successfully logged out",
  });
};