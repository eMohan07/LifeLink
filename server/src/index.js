const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const User = require('./models/User');
const seedData = require('./seed');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB Database and auto-seed if empty
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Auto-seeding initial demo data...');
      await seedData(false);
    }
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LifeLink API Gateway is operational',
    timestamp: new Date().toISOString(),
  });
});

// Domain Service Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/donors', require('./routes/donor.routes'));
app.use('/api/hospitals', require('./routes/hospital.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/donations', require('./routes/donation.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 LifeLink API Gateway & Services Running on Port ${PORT}`);
  console.log(`  Core Loop: Request → Match → Respond → Donate → AI`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
