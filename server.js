const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Product routes
app.use('/api/products', productRoutes);
// User authentication routes
app.use('/api/users', authRoutes);
// User profile routes
app.use('/api/users', userRoutes);
// Order routes
app.use('/api/orders', orderRoutes);
// Cart routes
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
