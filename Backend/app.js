import express from 'express';
import authRouter from './src/routes/auth.routes.js';
import { interviewRouter } from './src/routes/interview.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors"

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

/* using all the routes here */
app.use('/api/auth',authRouter);
app.use('/api/interview', interviewRouter)








export default app;