import express from 'express';
import 'dotenv/config'
import { connectDB } from './config/db';
import {userRouter, projectRouter, experienceRouter } from './routers';
import { corsConfig } from './config/cors';
import cors from 'cors';

connectDB()
const app = express();

app.use(cors(corsConfig))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Declare routes
app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', experienceRouter)

export default app;