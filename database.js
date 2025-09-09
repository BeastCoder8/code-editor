const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database.sqlite');

let db = null;

const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
};

const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            console.log('Connected to SQLite database');

            // Create tables
            createTables()
                .then(() => {
                    console.log('Database tables created successfully');
                    resolve();
                })
                .catch(reject);
        });
    });
};

const createTables = async () => {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        // Users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                ai_credits INTEGER DEFAULT 100,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                reject(err);
                return;
            }

            // Projects table
            db.run(`
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    user_id INTEGER NOT NULL,
                    template TEXT,
                    ai_enabled BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Files table
                db.run(`
                    CREATE TABLE IF NOT EXISTS files (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        path TEXT NOT NULL,
                        content TEXT,
                        language TEXT,
                        project_id INTEGER NOT NULL,
                        ai_suggestions_enabled BOOLEAN DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                    )
                `, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Execution history table
                    db.run(`
                        CREATE TABLE IF NOT EXISTS execution_history (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            project_id INTEGER NOT NULL,
                            user_id INTEGER NOT NULL,
                            language TEXT NOT NULL,
                            code TEXT NOT NULL,
                            output TEXT,
                            error TEXT,
                            execution_time INTEGER,
                            ai_optimized BOOLEAN DEFAULT 0,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
                            FOREIGN KEY (user_id) REFERENCES users (id)
                        )
                    `, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        // AI Usage tracking table
                        db.run(`
                            CREATE TABLE IF NOT EXISTS ai_usage (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER NOT NULL,
                                project_id INTEGER,
                                feature_type TEXT NOT NULL,
                                language TEXT,
                                tokens_used INTEGER DEFAULT 0,
                                cost_credits INTEGER DEFAULT 1,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users (id),
                                FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE SET NULL
                            )
                        `, (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            // AI Chat History table
                            db.run(`
                                CREATE TABLE IF NOT EXISTS ai_chat_history (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    user_id INTEGER NOT NULL,
                                    project_id INTEGER,
                                    message TEXT NOT NULL,
                                    response TEXT NOT NULL,
                                    language TEXT,
                                    context_code TEXT,
                                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                    FOREIGN KEY (user_id) REFERENCES users (id),
                                    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                                )
                            `, (err) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                // AI Suggestions Cache table
                                db.run(`
                                    CREATE TABLE IF NOT EXISTS ai_suggestions_cache (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        code_hash TEXT NOT NULL,
                                        language TEXT NOT NULL,
                                        feature_type TEXT NOT NULL,
                                        suggestions TEXT NOT NULL,
                                        confidence REAL DEFAULT 0.5,
                                        expires_at DATETIME NOT NULL,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                    )
                                `, (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }

                                    // Code Analysis Results table
                                    db.run(`
                                        CREATE TABLE IF NOT EXISTS code_analysis (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            file_id INTEGER NOT NULL,
                                            analysis_type TEXT NOT NULL,
                                            results TEXT NOT NULL,
                                            score REAL DEFAULT 0,
                                            issues TEXT,
                                            suggestions TEXT,
                                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                            FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
                                        )
                                    `, (err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }

                                        // Create indexes for better performance
                                        createIndexes()
                                            .then(() => resolve())
                                            .catch(reject);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

const createIndexes = async () => {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date ON ai_usage(user_id, created_at)',
            'CREATE INDEX IF NOT EXISTS idx_ai_chat_project ON ai_chat_history(project_id, created_at)',
            'CREATE INDEX IF NOT EXISTS idx_ai_suggestions_hash ON ai_suggestions_cache(code_hash, language, feature_type)',
            'CREATE INDEX IF NOT EXISTS idx_code_analysis_file ON code_analysis(file_id, analysis_type)',
            'CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id)',
            'CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id)'
        ];

        let completed = 0;
        const total = indexes.length;

        if (total === 0) {
            resolve();
            return;
        }

        indexes.forEach(indexSql => {
            db.run(indexSql, (err) => {
                if (err) {
                    console.warn('Index creation warning:', err.message);
                }
                completed++;
                if (completed === total) {
                    resolve();
                }
            });
        });
    });
};

const runQuery = (query, params = []) => {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

const getQuery = (query, params = []) => {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const allQuery = (query, params = []) => {
    const db = getDatabase();
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// AI-specific helper functions
const deductAICredits = async (userId, credits = 1) => {
    try {
        const result = await runQuery(`
            UPDATE users 
            SET ai_credits = GREATEST(0, ai_credits - ?) 
            WHERE id = ? AND ai_credits >= ?
        `, [credits, userId, credits]);

        return result.changes > 0;
    } catch (error) {
        console.error('Error deducting AI credits:', error);
        return false;
    }
};

const getUserAICredits = async (userId) => {
    try {
        const user = await getQuery('SELECT ai_credits FROM users WHERE id = ?', [userId]);
        return user ? user.ai_credits : 0;
    } catch (error) {
        console.error('Error getting AI credits:', error);
        return 0;
    }
};

const cacheAISuggestion = async (codeHash, language, featureType, suggestions, confidence = 0.5) => {
    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Cache for 24 hours

        await runQuery(`
            INSERT OR REPLACE INTO ai_suggestions_cache 
            (code_hash, language, feature_type, suggestions, confidence, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [codeHash, language, featureType, JSON.stringify(suggestions), confidence, expiresAt.toISOString()]);

        return true;
    } catch (error) {
        console.error('Error caching AI suggestion:', error);
        return false;
    }
};

const getCachedAISuggestion = async (codeHash, language, featureType) => {
    try {
        const cached = await getQuery(`
            SELECT suggestions, confidence 
            FROM ai_suggestions_cache 
            WHERE code_hash = ? AND language = ? AND feature_type = ?
            AND expires_at > datetime('now')
        `, [codeHash, language, featureType]);

        if (cached) {
            return {
                suggestions: JSON.parse(cached.suggestions),
                confidence: cached.confidence
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting cached AI suggestion:', error);
        return null;
    }
};

module.exports = {
    initializeDatabase,
    getDatabase,
    runQuery,
    getQuery,
    allQuery,
    deductAICredits,
    getUserAICredits,
    cacheAISuggestion,
    getCachedAISuggestion
};
