import express from 'express';
import { AllUserController, logincontroller, signupcontroller, logoutcontroller } from '../Controllers/UserController.js';
export const userRouter = express.Router();
userRouter.post('/alluser', AllUserController);
userRouter.post('/login', logincontroller);
userRouter.post('/signup', signupcontroller);
userRouter.post('/logout', logoutcontroller);
userRouter.get('/login', (req, res) => {
    return res.send('login route working');
});
console.log("USER ROUTER LOADED");
//# sourceMappingURL=UserRouter.js.map