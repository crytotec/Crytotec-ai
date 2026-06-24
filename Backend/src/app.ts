import express from 'express'
import dotenv from 'dotenv'
import { AllRouter } from './Routes/index'
import cors from "cors";
import morgan from "morgan"
import { Request, Response } from 'express-serve-static-core';
import cookieParser from 'cookie-parser';

dotenv.config()

export const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "https://crytotec-ai.vercel.app",
      "http://localhost:5173"
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev"))

app.get('/', (req: Request, res: Response) => {
  res.send('working at port 5000')
})

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/api/v1', AllRouter)