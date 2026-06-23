import express from 'express'
import { AllUserController, logincontroller, signupcontroller, logoutcontroller, verifyUser} from '../Controllers/UserController';
import { loginValidation, Signupvalidate, validated } from '../utilis/Validator';
import { verifyToken } from '../utilis/Token-maniger';
export const userRouter = express.Router();


userRouter.post('/alluser',  AllUserController)
userRouter.post('/login', validated(loginValidation),logincontroller)
userRouter.get('/auth-status', verifyToken,verifyUser)
userRouter.post('/signup', validated(Signupvalidate),signupcontroller)
userRouter.post('/logout', logoutcontroller)



console.log("USER ROUTER LOADED");

