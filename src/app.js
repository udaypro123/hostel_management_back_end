import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";

// ---- CORS ----
const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));
app.use(express.static('public'));
app.use(cookieParser());

export {app}