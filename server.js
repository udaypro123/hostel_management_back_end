import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/users.route.js';
import hostelRoutes from './routes/hostels.route.js';
import wardenRoutes from './routes/wardens.route.js';
import studentAndDegreeRoutes from './routes/student.route.js';
import paymentroutes from './routes/payment.route.js';
import annoucementRoutes from './routes/announcement.route.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

const app = express();

// ---- PROXY SETTINGS ----
// Required for Vercel to correctly detect client IP for rate-limiting
app.set('trust proxy', 1); // trust first proxy (Vercel edge)

// ---- SECURITY ----
app.use(helmet());

// ---- RATE LIMITING ----
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
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
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
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

// ---- MONGODB CONNECTION ----
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// ---- HEALTH CHECK ----
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running. Try /api/health for details.'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ---- ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/students', studentAndDegreeRoutes);
app.use('/api/payment', paymentroutes);
app.use('/api/announcement', annoucementRoutes);
app.use('/api', wardenRoutes);

// ---- STATIC FILES ----
app.use('/uploads', express.static('uploads'));

// ---- ERROR HANDLING ----
app.use(notFound);
app.use(errorHandler);

// ---- SERVER ----
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

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
