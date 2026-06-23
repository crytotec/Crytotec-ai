import express from 'express';
import { userRouter } from './UserRouter.js';
export const AllRouter = express.Router();
AllRouter.get('/user', (req, res) => {
    res.send('Api is working');
});
AllRouter.use('/user', userRouter);
//# sourceMappingURL=index.js.map