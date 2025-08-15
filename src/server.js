
// import helmet from 'helmet';
// import morgan from 'morgan';
// import compression from 'compression';
// import rateLimit from 'express-rate-limit';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// // Import routes
// import authRoutes from './routes/auth.route.js';
// import userRoutes from './routes/users.route.js';
// import hostelRoutes from './routes/hostels.route.js';
// import wardenRoutes from './routes/wardens.route.js';
// import studentAndDegreeRoutes from './routes/student.route.js';
// import paymentroutes from './routes/payment.route.js';
// import annoucementRoutes from './routes/announcement.route.js';

// // Import middleware
// import errorHandler from './middleware/errorHandler.js';
// import notFound from './middleware/notFound.js';
// import connectDB from './db/index.js';
// import { app } from './app.js';

// dotenv.config({
//   path:"./.env"
// });


// app.set('trust proxy', 1); 

// // // ---- SECURITY ----
// app.use(helmet());

// // // ---- RATE LIMITING ----
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
//   message: {
//     error: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });


// app.use('/api/', limiter);


// app.use(compression());

// // // ---- LOGGING ----
// app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// // ---- MONGODB CONNECTION ----
// connectDB()
//   .then(() => 
//   app.listen(process.env.PORT || 8000, ()=>{
//     console.log( `✅ Connected to MongoDB PORT ${process.env.PORT || 8000}`)
//   }))
//   .catch((error) => {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   });

// // // ---- HEALTH CHECK ----
// app.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Backend is running. '
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // ---- ROUTES ----
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/hostels', hostelRoutes);
// app.use('/api/students', studentAndDegreeRoutes);
// app.use('/api/payment', paymentroutes);
// app.use('/api/announcement', annoucementRoutes);
// app.use('/api', wardenRoutes);


// // // ---- ERROR HANDLING ----
// app.use(notFound);
// app.use(errorHandler);

// // // ---- GRACEFUL SHUTDOWN ----
// const gracefulShutdown = () => {
//   console.log('Gracefully shutting down...');
//   server.close(() => {
//     console.log('Server closed');
//     mongoose.connection.close();
//   });
// };

// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

// export default app;

// server.js
import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

// ---- SERVERLESS MONGODB CONNECTION ----
let cachedConn = null;

async function serverlessConnectDB() {
  if (cachedConn) return cachedConn;
  cachedConn = await connectDB();
  return cachedConn;
}

// ---- VERCEL HANDLER ----
import serverless from 'serverless-http';

const handler = serverless(async (req, res) => {
  try {
    await serverlessConnectDB(); // ensure DB is connected
    app(req, res); // forward request to Express app
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default handler;

