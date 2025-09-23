import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import propertyRoutes from './routes/propertyRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import neighborhoodRoutes from './routes/neighborhoodRoutes.js';
import adRoutes from './routes/adRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Add your production domain
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/neighborhoods', neighborhoodRoutes);
app.use('/api/ads', adRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 PropertyFinder API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});