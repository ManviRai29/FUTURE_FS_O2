require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (skipped automatically in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Mini CRM API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/stats', statsRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
