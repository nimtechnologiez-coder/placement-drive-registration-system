const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// Routes
app.use('/api/registrations', registrationRoutes);

// Database check (Optional but recommended)
const db = require('./config/db');
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
