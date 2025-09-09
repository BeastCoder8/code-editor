const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const fileRoutes = require('./src/routes/files');
const executionRoutes = require('./src/routes/execution');
const aiRoutes = require('./src/routes/ai'); // New AI routes
const { initializeDatabase } = require('./src/config/database');
const { authenticateToken } = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parsing with increased limits for AI features
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check with AI service status
app.get('/health', (req, res) => {
    const aiEnabled = !!(process.env.OPENAI_API_KEY || process.env.COHERE_API_KEY);

    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'replit-clone-ai-backend',
        version: '2.0.0',
        features: {
            authentication: true,
            projectManagement: true,
            codeExecution: true,
            aiAssistance: aiEnabled,
            aiCompletion: aiEnabled,
            aiErrorFix: aiEnabled,
            aiOptimization: aiEnabled,
            aiChat: aiEnabled
        },
        ai: {
            enabled: aiEnabled,
            providers: {
                openai: !!process.env.OPENAI_API_KEY,
                cohere: !!process.env.COHERE_API_KEY
            }
        }
    });
});

// API Info endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'Replit Clone AI Backend',
        version: '2.0.0',
        description: 'AI-enhanced collaborative code editor backend',
        endpoints: {
            auth: '/api/auth',
            projects: '/api/projects',
            files: '/api/files',
            execution: '/api/execution',
            ai: '/api/ai'
        },
        features: [
            'User Authentication',
            'Project Management',
            'File Operations',
            'Code Execution',
            'AI Code Completion',
            'AI Error Fixing',
            'AI Code Explanation',
            'AI Code Optimization',
            'AI Chat Assistant',
            'AI Documentation Generation',
            'AI Refactoring Suggestions'
        ],
        aiFeatures: [
            'Smart code completion',
            'Intelligent error detection and fixing', 
            'Code explanation and documentation',
            'Performance optimization suggestions',
            'Interactive AI coding assistant',
            'Automated refactoring recommendations',
            'Multi-language support',
            'Context-aware suggestions'
        ]
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/files', authenticateToken, fileRoutes);
app.use('/api/execution', authenticateToken, executionRoutes);
app.use('/api/ai', authenticateToken, aiRoutes); // AI routes with authentication

// AI Credits middleware for monitoring usage
app.use('/api/ai', (req, res, next) => {
    // Add user's AI credits info to response headers
    if (req.user) {
        getUserAICredits(req.user.id).then(credits => {
            res.set('X-AI-Credits-Remaining', credits.toString());
        }).catch(err => {
            console.error('Error getting AI credits:', err);
        });
    }
    next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.details || {}
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing authentication token'
        });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'File too large',
            message: 'File size exceeds the maximum allowed limit'
        });
    }

    // AI-specific errors
    if (err.message && err.message.includes('AI')) {
        return res.status(503).json({
            error: 'AI Service Error',
            message: 'AI service is temporarily unavailable',
            suggestion: 'Please try again later or use manual coding features'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            'GET /health',
            'GET /api',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/projects',
            'POST /api/ai/complete',
            'POST /api/ai/chat'
        ]
    });
});

// Graceful shutdown handling
const gracefulShutdown = () => {
    console.log('Received shutdown signal, closing server gracefully...');
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database with AI tables
        await initializeDatabase();
        console.log('✅ Database initialized with AI features');

        // Check AI service configuration
        const openaiConfigured = !!process.env.OPENAI_API_KEY;
        const cohereConfigured = !!process.env.COHERE_API_KEY;

        if (openaiConfigured || cohereConfigured) {
            console.log('🤖 AI services configured:');
            if (openaiConfigured) console.log('  - OpenAI: ✓');
            if (cohereConfigured) console.log('  - Cohere: ✓');
        } else {
            console.log('⚠️  No AI services configured. AI features will use fallback responses.');
            console.log('   Add OPENAI_API_KEY or COHERE_API_KEY to enable full AI functionality.');
        }

        // Start the server
        app.listen(PORT, () => {
            console.log('🚀 AI-Enhanced Replit Clone Backend Started!');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌐 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API info: http://localhost:${PORT}/api`);
            console.log(`🤖 AI features: http://localhost:${PORT}/api/ai/health`);
            console.log('');
            console.log('🎯 Available AI Features:');
            console.log('  - Smart Code Completion');
            console.log('  - Intelligent Error Fixing');
            console.log('  - Code Explanation & Documentation');
            console.log('  - Performance Optimization');
            console.log('  - Interactive AI Chat Assistant');
            console.log('  - Automated Refactoring Suggestions');
            console.log('');
            console.log('Ready to enhance your coding experience! 🌟');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('');
        console.log('Troubleshooting tips:');
        console.log('1. Check if the database file is writable');
        console.log('2. Ensure all required environment variables are set');
        console.log('3. Verify Node.js version is 14 or higher');
        console.log('4. Check if the port is already in use');
        process.exit(1);
    }
};

// Add the missing import for getUserAICredits
const { getUserAICredits } = require('./src/config/database');

startServer();

module.exports = app;
