const express = require('express');
const rateLimit = require('express-rate-limit');
const AICodeAssistant = require('../ai/AICodeAssistant');
const { runQuery, getQuery, allQuery } = require('../config/database');

const router = express.Router();

// Initialize AI assistant
const aiAssistant = new AICodeAssistant();

// Rate limiting for AI endpoints (more restrictive due to cost)
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 AI requests per windowMs
    message: 'Too many AI requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all AI routes
router.use(aiLimiter);

// AI Code Completion
router.post('/complete', async (req, res) => {
    try {
        const { code, language, position, context, projectId } = req.body;

        if (!code || !language || position === undefined) {
            return res.status(400).json({ 
                error: 'Code, language, and position are required' 
            });
        }

        // Get AI completion suggestions
        const result = await aiAssistant.getCodeCompletion(code, language, position, context);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'completion', language]);
        }

        res.json({
            success: true,
            suggestions: result.suggestions,
            confidence: result.confidence,
            feature: 'code_completion'
        });

    } catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({
            error: 'AI completion failed',
            suggestions: [],
            confidence: 0
        });
    }
});

// AI Error Analysis and Fixing
router.post('/fix-error', async (req, res) => {
    try {
        const { code, errorMessage, language, projectId } = req.body;

        if (!code || !errorMessage || !language) {
            return res.status(400).json({ 
                error: 'Code, error message, and language are required' 
            });
        }

        // Get AI error analysis and fix
        const result = await aiAssistant.analyzeAndFixError(code, errorMessage, language);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'error_fix', language]);
        }

        res.json({
            success: result.success,
            explanation: result.explanation,
            fixedCode: result.fixedCode,
            bestPractices: result.bestPractices,
            feature: 'error_fix'
        });

    } catch (error) {
        console.error('AI error fix error:', error);
        res.status(500).json({
            error: 'AI error analysis failed',
            success: false
        });
    }
});

// AI Code Explanation
router.post('/explain', async (req, res) => {
    try {
        const { code, language, projectId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ 
                error: 'Code and language are required' 
            });
        }

        // Get AI code explanation
        const result = await aiAssistant.explainCode(code, language);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'explanation', language]);
        }

        res.json({
            success: true,
            explanation: result.explanation,
            feature: 'code_explanation'
        });

    } catch (error) {
        console.error('AI explanation error:', error);
        res.status(500).json({
            error: 'AI explanation failed',
            explanation: 'Unable to explain code at this time.'
        });
    }
});

// AI Code Optimization
router.post('/optimize', async (req, res) => {
    try {
        const { code, language, projectId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ 
                error: 'Code and language are required' 
            });
        }

        // Get AI optimization suggestions
        const result = await aiAssistant.optimizeCode(code, language);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'optimization', language]);
        }

        res.json({
            success: true,
            optimizedCode: result.optimizedCode,
            suggestions: result.suggestions,
            explanation: result.explanation,
            feature: 'code_optimization'
        });

    } catch (error) {
        console.error('AI optimization error:', error);
        res.status(500).json({
            error: 'AI optimization failed',
            optimizedCode: req.body.code || '',
            suggestions: []
        });
    }
});

// AI Chat Assistant
router.post('/chat', async (req, res) => {
    try {
        const { message, codeContext, language, projectId } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Get AI chat response
        const result = await aiAssistant.chatAssistant(message, codeContext, language);

        // Store chat history
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_chat_history (user_id, project_id, message, response, language, created_at)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, message, result.response, language || 'general']);
        }

        // Store usage analytics
        await runQuery(`
            INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [req.user.id, projectId || null, 'chat', language || 'general']);

        res.json({
            success: true,
            response: result.response,
            suggestions: result.suggestions,
            feature: 'ai_chat'
        });

    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({
            error: 'AI chat failed',
            response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.'
        });
    }
});

// AI Documentation Generation
router.post('/document', async (req, res) => {
    try {
        const { code, language, projectId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ 
                error: 'Code and language are required' 
            });
        }

        // Generate AI documentation
        const result = await aiAssistant.generateDocumentation(code, language);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'documentation', language]);
        }

        res.json({
            success: true,
            documentation: result.documentation,
            formattedCode: result.formattedCode,
            feature: 'documentation'
        });

    } catch (error) {
        console.error('AI documentation error:', error);
        res.status(500).json({
            error: 'AI documentation failed',
            documentation: 'Unable to generate documentation at this time.'
        });
    }
});

// AI Refactoring Suggestions
router.post('/refactor', async (req, res) => {
    try {
        const { code, language, projectId } = req.body;

        if (!code || !language) {
            return res.status(400).json({ 
                error: 'Code and language are required' 
            });
        }

        // Get AI refactoring suggestions
        const result = await aiAssistant.suggestRefactoring(code, language);

        // Store usage analytics
        if (projectId) {
            await runQuery(`
                INSERT INTO ai_usage (user_id, project_id, feature_type, language, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [req.user.id, projectId, 'refactoring', language]);
        }

        res.json({
            success: true,
            suggestions: result.suggestions,
            explanation: result.explanation,
            priority: result.priority,
            feature: 'refactoring'
        });

    } catch (error) {
        console.error('AI refactoring error:', error);
        res.status(500).json({
            error: 'AI refactoring suggestions failed',
            suggestions: []
        });
    }
});

// Get AI Chat History
router.get('/chat/history/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        // Verify user has access to project
        const project = await getQuery(
            'SELECT id FROM projects WHERE id = ? AND user_id = ?',
            [projectId, req.user.id]
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get chat history
        const history = await allQuery(`
            SELECT id, message, response, language, created_at
            FROM ai_chat_history
            WHERE user_id = ? AND project_id = ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, projectId, limit, offset]);

        res.json({ 
            success: true, 
            history: history.reverse() // Show oldest first
        });

    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
});

// Get AI Usage Statistics
router.get('/stats', async (req, res) => {
    try {
        const { period = '30' } = req.query; // Default to 30 days

        // Get usage stats for the user
        const stats = await allQuery(`
            SELECT 
                feature_type,
                language,
                COUNT(*) as usage_count,
                DATE(created_at) as usage_date
            FROM ai_usage
            WHERE user_id = ? 
            AND created_at >= datetime('now', '-${parseInt(period)} days')
            GROUP BY feature_type, language, DATE(created_at)
            ORDER BY created_at DESC
        `, [req.user.id]);

        // Aggregate stats
        const summary = await getQuery(`
            SELECT 
                COUNT(*) as total_requests,
                COUNT(DISTINCT feature_type) as features_used,
                COUNT(DISTINCT language) as languages_used
            FROM ai_usage
            WHERE user_id = ?
            AND created_at >= datetime('now', '-${parseInt(period)} days')
        `, [req.user.id]);

        res.json({ 
            success: true, 
            stats,
            summary: summary || { total_requests: 0, features_used: 0, languages_used: 0 }
        });

    } catch (error) {
        console.error('Get AI stats error:', error);
        res.status(500).json({ error: 'Failed to get AI statistics' });
    }
});

// AI Health Check
router.get('/health', async (req, res) => {
    try {
        // Test AI service availability
        const isOpenAIConfigured = !!process.env.OPENAI_API_KEY;
        const isCohereConfigured = !!process.env.COHERE_API_KEY;

        res.json({
            success: true,
            services: {
                openai: isOpenAIConfigured,
                cohere: isCohereConfigured
            },
            features: [
                'code_completion',
                'error_fixing', 
                'code_explanation',
                'code_optimization',
                'ai_chat',
                'documentation',
                'refactoring'
            ],
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI health check error:', error);
        res.status(500).json({ error: 'AI health check failed' });
    }
});

module.exports = router;
