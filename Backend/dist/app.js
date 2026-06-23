import express from 'express';
import dotenv from 'dotenv';
import { AllRouter } from './Routes/index.js';
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
dotenv.config();
export const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
app.use('/api/v1', AllRouter);
app.get('/', (req, res) => {
    res.send('working at port 5000');
});
//# sourceMappingURL=app.js.map