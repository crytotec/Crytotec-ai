import express from 'express'
import { userRouter } from './UserRouter';
import { ChatRouter } from './ChatRouter';


export const AllRouter = express.Router();



AllRouter.use('/user', userRouter) 
AllRouter.use('/chat', ChatRouter) 

