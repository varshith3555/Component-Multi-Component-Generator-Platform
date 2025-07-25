require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Redis connection
if (process.env.REDIS_URL && process.env.REDIS_URL !== 'your_redis_url_here') {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().then(() => console.log('Redis connected'))
    .catch((err) => console.error('Redis connection error:', err));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const sessionRoutes = require('./routes/sessions');
const aiRoutes = require('./routes/ai');
app.use('/api/sessions', sessionRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 