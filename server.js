import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

// Import routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/users.route.js';
import hostelRoutes from './routes/hostels.route.js';
import wardenRoutes from './routes/wardens.route.js';
import studentAndDegreeRoutes from './routes/student.route.js';
import paymentroutes from './routes/payment.route.js';
import annoucementRoutes from './routes/announcement.route.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

const app = express();

// ---- PROXY SETTINGS ----
app.set('trust proxy', 1); // Vercel edge proxy

// ---- SECURITY ----
app.use(helmet());

// ---- RATE LIMITING ----
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests from this IP, try later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ---- CORS ----
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// ---- BODY PARSERS ----
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ---- LOGGING ----
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ---- MONGODB ----
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ---- JWT AUTH MIDDLEWARE ----
export const authenticateJWT = (req, res, next) => {
  let token = null;

  // Check Authorization header first
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // If not, check cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ error: 'Unauthorized: token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
};

// ---- HEALTH CHECK ----
app.get('/', (req, res) => res.json({ success: true, message: 'Backend running' }));
app.get('/api/health', (req, res) => res.json({ success: true, uptime: process.uptime() }));

// ---- ROUTES ----
app.use('/api/auth', authRoutes); // login/register routes
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/hostels', authenticateJWT, hostelRoutes);
app.use('/api/students', authenticateJWT, studentAndDegreeRoutes);
app.use('/api/payment', authenticateJWT, paymentroutes);
app.use('/api/announcement', authenticateJWT, annoucementRoutes);
app.use('/api', authenticateJWT, wardenRoutes);

// ---- STATIC FILES ----
app.use('/uploads', express.static('uploads'));

// ---- ERROR HANDLING ----
app.use(notFound);
app.use(errorHandler);

// ---- SERVER ----
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ---- GRACEFUL SHUTDOWN ----
const gracefulShutdown = () => {
  console.log('Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
