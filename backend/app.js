const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

const app = express();

morgan.token('request-path', (request) => request.path);

app.use(morgan(
    ':method :request-path :status :response-time ms',
    {
        stream: {
            write: (message) => {
                logger.info(message.trim());
            }
        }
    }
));

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(async (request, response, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/health', (request, response) => {
    response.status(200).json({
        status: 'ok',
        message: 'API is running',
        database: mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected'
    });
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.use((request, response) => {
    response.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

app.use(errorHandler);

module.exports = app;