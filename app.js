// Online Code Editor - Professional IDE
class CodeEditor {
    constructor() {
        this.editor = null;
        this.currentFile = null;
        this.files = new Map();
        this.openTabs = new Map();
        this.activeTab = null;
        this.projectName = 'My Project';
        this.selectedTemplate = null;
        this.currentLayout = 'split';
        this.theme = 'dark';
        this.previewUpdateTimeout = null;
        this.monacoReady = false;
        
        // Templates from the provided data
        this.templates = new Map([
            ['blank', {
                name: 'Blank Project',
                description: 'Start with empty HTML, CSS, and JS files',
                icon: '📄',
                files: new Map([
                    ['index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start coding your amazing project here!</p>
    
    <script src="script.js"></script>
</body>
</html>`],
                    ['style.css', `/* Your CSS goes here */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
    font-size: 18px;
}`],
                    ['script.js', `// Your JavaScript goes here

console.log('Hello, World!');

// Example: Add click event to h1
document.addEventListener('DOMContentLoaded', function() {
    const heading = document.querySelector('h1');
    
    if (heading) {
        heading.addEventListener('click', function() {
            this.style.color = this.style.color === 'red' ? '#333' : 'red';
        });
    }
});`]
                ])
            }],
            ['landing-page', {
                name: 'Landing Page',
                description: 'Modern landing page template with hero section',
                icon: '🚀',
                files: new Map([
                    ['index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazing Product - Landing Page</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">🚀 Product</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-container">
            <h1 class="hero-title">Revolutionary Product</h1>
            <p class="hero-subtitle">Transform your workflow with our amazing solution</p>
            <button class="cta-button" id="ctaBtn">Get Started Free</button>
        </div>
    </section>

    <section id="features" class="features">
        <div class="container">
            <h2>Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Experience unprecedented speed and performance</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>Bank-level security to protect your data</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌍</div>
                    <h3>Global Scale</h3>
                    <p>Available worldwide with 99.9% uptime</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2024 Product. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`],
                    ['style.css', `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo {
    font-size: 24px;
    font-weight: bold;
    color: #007acc;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-menu a:hover {
    color: #007acc;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 150px 0 100px;
    margin-top: 70px;
}

.hero-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 20px;
    font-weight: 700;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 40px;
    opacity: 0.9;
}

.cta-button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 18px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.cta-button:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

/* Features Section */
.features {
    padding: 100px 0;
    background: #f8f9fa;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 60px;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 60px;
}

.feature-card {
    background: white;
    padding: 40px 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 30px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}`],
                    ['script.js', `// Landing Page JavaScript

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Landing page loaded successfully!');
    
    // Smooth scrolling
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // CTA Button interaction
    const ctaBtn = document.getElementById('ctaBtn');
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show alert (replace with actual functionality)
            setTimeout(() => {
                alert('🎉 Welcome! This would typically open a signup form or redirect to registration.');
            }, 200);
        });
    }
});`]
                ])
            }],
            ['portfolio', {
                name: 'Portfolio Website',
                description: 'Personal portfolio template with projects and skills',
                icon: '💼',
                files: new Map([
                    ['index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Developer Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-logo">John Doe</div>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>Hi, I'm <span class="highlight">John Doe</span></h1>
                <h2>Full Stack Developer</h2>
                <p>I create beautiful and functional web applications</p>
                <div class="hero-buttons">
                    <a href="#projects" class="btn btn-primary">View My Work</a>
                    <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                </div>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Me</h2>
                <div class="about-content">
                    <div class="about-text">
                        <p>I'm a passionate full-stack developer with 5+ years of experience creating web applications.</p>
                        <p>When I'm not coding, you can find me exploring new technologies or enjoying a good cup of coffee.</p>
                    </div>
                    <div class="about-image">
                        <div class="profile-placeholder">👨‍💻</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>`],
                    ['style.css', `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid #eee;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2563eb;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #2563eb;
}

/* Hero Section */
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.highlight {
    color: #fbbf24;
}

.hero-content h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 400;
    opacity: 0.9;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    display: inline-block;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #333;
}

.about {
    padding: 100px 0;
}

.about h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 60px;
    color: #333;
}

.about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #666;
    line-height: 1.7;
}

.profile-placeholder {
    font-size: 8rem;
    text-align: center;
    background: #f3f4f6;
    border-radius: 20px;
    padding: 2rem;
}`],
                    ['script.js', `// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('💼 Portfolio website loaded successfully!');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});`]
                ])
            }],
            ['dashboard', {
                name: 'Admin Dashboard',
                description: 'Modern admin dashboard with charts and data',
                icon: '📊',
                files: new Map([
                    ['index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>📊 Dashboard</h2>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active">🏠 Dashboard</a>
                <a href="#" class="nav-item">👥 Users</a>
                <a href="#" class="nav-item">📈 Analytics</a>
                <a href="#" class="nav-item">💰 Revenue</a>
                <a href="#" class="nav-item">⚙️ Settings</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin!</p>
            </header>

            <section class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>Total Users</h3>
                        <p class="stat-number">1,247</p>
                        <span class="stat-change positive">+12% from last month</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <h3>Revenue</h3>
                        <p class="stat-number">$84,500</p>
                        <span class="stat-change positive">+8% from last month</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-content">
                        <h3>Orders</h3>
                        <p class="stat-number">356</p>
                        <span class="stat-change negative">-3% from last month</span>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>`],
                    ['style.css', `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f8fafc;
    color: #334155;
    line-height: 1.6;
}

.dashboard {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 260px;
    background: #1e293b;
    color: white;
    position: fixed;
    height: 100vh;
}

.sidebar-header {
    padding: 2rem 1.5rem;
    border-bottom: 1px solid #334155;
}

.sidebar-nav {
    padding: 1rem 0;
}

.nav-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
    background: #334155;
    color: white;
}

.main-content {
    flex: 1;
    margin-left: 260px;
    padding: 2rem;
}

.header {
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.header p {
    color: #64748b;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
}

.stat-content h3 {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.25rem;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.stat-change {
    font-size: 0.75rem;
    font-weight: 500;
}

.stat-change.positive {
    color: #10b981;
}

.stat-change.negative {
    color: #ef4444;
}`],
                    ['script.js', `// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Admin Dashboard loaded successfully!');
    
    // Navigation interaction
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            console.log('Navigated to:', this.textContent.trim());
        });
    });
    
    // Animate numbers on load
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = element.textContent;
        const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        if (!isNaN(numericValue)) {
            animateNumber(element, 0, numericValue, finalValue);
        }
    });
    
    function animateNumber(element, start, end, finalText) {
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            
            if (finalText.includes('$')) {
                element.textContent = '$' + current.toLocaleString();
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = finalText;
            }
        }
        
        requestAnimationFrame(update);
    }
});`]
                ])
            }]
        ]);
        
        this.commands = [
            { name: 'New File', shortcut: 'Ctrl+N', action: () => this.showNewFileModal() },
            { name: 'Run Code', shortcut: 'Ctrl+R', action: () => this.runCode() },
            { name: 'Toggle Theme', shortcut: 'Ctrl+T', action: () => this.toggleTheme() },
            { name: 'Share Project', shortcut: 'Ctrl+S', action: () => this.showShareModal() },
            { name: 'Export Project', shortcut: 'Ctrl+E', action: () => this.showExportModal() },
            { name: 'Clear Console', shortcut: 'Ctrl+K', action: () => this.clearConsole() },
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeMonacoEditor();
        this.loadDefaultProject();
        this.updateProjectStatus();
        this.setupCommandPalette();
        this.detectSystemTheme();
    }

    setupEventListeners() {
        // Header controls
        document.getElementById('run-btn').addEventListener('click', () => this.runCode());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('share-btn').addEventListener('click', () => this.showShareModal());
        document.getElementById('export-btn').addEventListener('click', () => this.showExportModal());

        // Layout controls
        document.getElementById('layout-split').addEventListener('click', () => this.setLayout('split'));
        document.getElementById('layout-vertical').addEventListener('click', () => this.setLayout('vertical'));
        document.getElementById('layout-horizontal').addEventListener('click', () => this.setLayout('horizontal'));
        document.getElementById('layout-preview').addEventListener('click', () => this.setLayout('preview'));

        // Sidebar controls
        document.getElementById('new-file-btn').addEventListener('click', () => this.showNewFileModal());
        document.getElementById('new-folder-btn').addEventListener('click', () => this.showNewFolderModal());
        document.getElementById('template-btn').addEventListener('click', () => this.showTemplateModal());

        // Preview controls
        document.getElementById('refresh-preview').addEventListener('click', () => this.updatePreview());
        document.getElementById('open-preview').addEventListener('click', () => this.openPreviewInNewTab());

        // Console controls
        document.getElementById('clear-console').addEventListener('click', () => this.clearConsole());

        // Placeholder quick actions
        document.getElementById('quick-new-file').addEventListener('click', () => this.showNewFileModal());
        document.getElementById('quick-template').addEventListener('click', () => this.showTemplateModal());

        // Modal controls
        this.setupModalListeners();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Global click handler
        document.addEventListener('click', (e) => this.handleGlobalClick(e));

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    setupModalListeners() {
        // Generic modal close handlers
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-close');
                this.hideModal(modalId);
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // New file modal
        document.getElementById('create-file-btn').addEventListener('click', () => this.createNewFile());
        document.getElementById('new-file-name').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.createNewFile();
        });

        // Template modal
        document.getElementById('use-template-btn').addEventListener('click', () => this.useSelectedTemplate());

        // Share modal
        document.getElementById('copy-link').addEventListener('click', () => this.copyShareLink());
        document.querySelectorAll('.share-social').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.getAttribute('data-platform');
                this.shareOnSocial(platform);
            });
        });

        // Export modal
        document.getElementById('export-zip').addEventListener('click', () => this.exportAsZip());
        document.getElementById('export-html').addEventListener('click', () => this.exportAsHtml());
        document.getElementById('export-codepen').addEventListener('click', () => this.exportToCodePen());

        // Command palette
        document.getElementById('command-input').addEventListener('input', (e) => this.filterCommands(e.target.value));
        document.getElementById('command-input').addEventListener('keydown', (e) => this.handleCommandInput(e));
    }

    initializeMonacoEditor() {
        if (typeof require === 'undefined') {
            this.logError('Monaco Editor loader not available');
            return;
        }

        require.config({
            paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
        });

        require(['vs/editor/editor.main'], () => {
            try {
                this.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                    value: '',
                    language: 'javascript',
                    theme: this.theme === 'dark' ? 'vs-dark' : 'vs',
                    automaticLayout: true,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    minimap: { enabled: true },
                    wordWrap: 'on',
                    contextmenu: true,
                    selectOnLineNumbers: true,
                    glyphMargin: true,
                    folding: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    quickSuggestions: true,
                    tabSize: 2,
                    insertSpaces: true
                });

                // Editor change listener
                this.editor.onDidChangeModelContent(() => {
                    if (this.currentFile) {
                        const content = this.editor.getValue();
                        this.files.set(this.currentFile, content);
                        this.markTabAsModified(this.currentFile);
                        this.schedulePreviewUpdate();
                    }
                });

                this.monacoReady = true;
                this.logSuccess('Monaco Editor initialized successfully');
                
                // Load current file if available
                if (this.currentFile && this.files.has(this.currentFile)) {
                    this.updateEditorContent();
                }
            } catch (error) {
                this.logError(`Failed to initialize Monaco Editor: ${error.message}`);
            }
        });
    }

    loadDefaultProject() {
        // Load default blank template
        const defaultTemplate = this.templates.get('blank');
        this.files.clear();
        defaultTemplate.files.forEach((content, filename) => {
            this.files.set(filename, content);
        });

        this.updateFileExplorer();
        this.openFile('index.html');
    }

    // File Management
    updateFileExplorer() {
        const explorer = document.getElementById('file-explorer');
        explorer.innerHTML = '';

        const sortedFiles = Array.from(this.files.keys()).sort();
        
        sortedFiles.forEach(filename => {
            const fileItem = this.createFileItem(filename);
            explorer.appendChild(fileItem);
        });
    }

    createFileItem(filename) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.setAttribute('data-file', filename);

        const icon = this.getFileIcon(filename);
        const name = filename.split('/').pop();

        item.innerHTML = `
            <svg class="file-item__icon" viewBox="0 0 24 24" fill="currentColor">
                ${icon}
            </svg>
            <span class="file-item__name">${name}</span>
            <div class="file-item__actions">
                <button class="icon-btn file-action" title="Delete" data-filename="${filename}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                </button>
            </div>
        `;

        // File click handler
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.file-item__actions')) {
                this.openFile(filename);
            }
        });

        // Delete button handler
        const deleteBtn = item.querySelector('.file-action');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filenameToDelete = e.target.closest('.file-action').getAttribute('data-filename');
            this.deleteFile(filenameToDelete);
        });

        return item;
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        
        const icons = {
            'html': '<path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"/>',
            'css': '<path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z"/>',
            'js': '<path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>',
            'json': '<path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5C3,3.93 3.93,3 5,3M19,3C20.1,3 21,3.93 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19C21,20.1 20.1,21 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z"/>',
            'md': '<path d="M22.269,19.385c-1.9,0-2.78-.155-2.78-1.735v-5.604c0-.424,0-2.735-3.668-2.735c-1.214,0-2.357.515-2.357,1.735v7.604c0,1.58-.88,1.735-2.78,1.735s-2.78-.155-2.78-1.735v-13.48c0-1.58.88-1.735,2.78-1.735s2.78.155,2.78,1.735v5.604c0,.424,0,2.735,3.668,2.735c1.214,0,2.357-.515,2.357-1.735v-7.604c0-1.58.88-1.735,2.78-1.735s2.78.155,2.78,1.735v13.48c0,1.58-.88,1.735-2.78,1.735"/>',
            'default': '<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>'
        };
        
        return icons[ext] || icons.default;
    }

    openFile(filename) {
        if (!this.files.has(filename)) {
            this.logWarning(`File ${filename} not found`);
            return;
        }

        this.currentFile = filename;
        this.hideEditorPlaceholder();
        this.updateEditorContent();
        this.addTab(filename);
        this.updateActiveFileInExplorer(filename);
        this.schedulePreviewUpdate();
    }

    updateEditorContent() {
        if (!this.monacoReady || !this.editor || !this.currentFile) return;

        try {
            const content = this.files.get(this.currentFile) || '';
            this.editor.setValue(content);
            
            const language = this.getFileLanguage(this.currentFile);
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
            
            this.editor.focus();
        } catch (error) {
            this.logError(`Failed to update editor content: ${error.message}`);
        }
    }

    getFileLanguage(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const languageMap = {
            'html': 'html',
            'css': 'css', 
            'js': 'javascript',
            'json': 'json',
            'md': 'markdown',
            'py': 'python',
            'txt': 'plaintext'
        };
        
        return languageMap[ext] || 'plaintext';
    }

    // Tab Management
    addTab(filename) {
        if (this.openTabs.has(filename)) {
            this.switchToTab(filename);
            return;
        }

        const tabsContainer = document.getElementById('editor-tabs');
        const tab = document.createElement('div');
        tab.className = 'editor-tab';
        tab.setAttribute('data-file', filename);
        
        const displayName = filename.split('/').pop();
        tab.innerHTML = `
            <span class="editor-tab__name">${displayName}</span>
            <span class="editor-tab__modified"></span>
            <button class="editor-tab__close">×</button>
        `;

        tab.addEventListener('click', (e) => {
            if (e.target.classList.contains('editor-tab__close')) {
                e.stopPropagation();
                this.closeTab(filename);
            } else {
                this.switchToTab(filename);
            }
        });

        tabsContainer.appendChild(tab);
        this.openTabs.set(filename, tab);
        this.switchToTab(filename);
    }

    switchToTab(filename) {
        if (!this.files.has(filename)) return;

        // Update tab active state
        document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
        const tab = this.openTabs.get(filename);
        if (tab) tab.classList.add('active');

        this.activeTab = filename;
        
        // Update current file and editor content
        this.currentFile = filename;
        this.updateEditorContent();
        this.updateActiveFileInExplorer(filename);
    }

    closeTab(filename) {
        const tab = this.openTabs.get(filename);
        if (tab) {
            tab.remove();
            this.openTabs.delete(filename);
        }

        if (this.activeTab === filename) {
            const remainingTabs = Array.from(this.openTabs.keys());
            if (remainingTabs.length > 0) {
                this.switchToTab(remainingTabs[remainingTabs.length - 1]);
            } else {
                this.showEditorPlaceholder();
                this.currentFile = null;
                this.activeTab = null;
            }
        }
    }

    markTabAsModified(filename) {
        const tab = this.openTabs.get(filename);
        if (tab && !tab.classList.contains('modified')) {
            tab.classList.add('modified');
        }
    }

    updateActiveFileInExplorer(filename) {
        document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
        const fileItem = document.querySelector(`[data-file="${filename}"]`);
        if (fileItem) fileItem.classList.add('active');
    }

    // Preview Management
    schedulePreviewUpdate() {
        if (this.previewUpdateTimeout) {
            clearTimeout(this.previewUpdateTimeout);
        }
        
        this.previewUpdateTimeout = setTimeout(() => {
            this.updatePreview();
        }, 500); // Debounce updates
    }

    updatePreview() {
        const htmlFile = this.findHtmlFile();
        if (!htmlFile) {
            this.showPreviewPlaceholder();
            return;
        }

        const htmlContent = this.files.get(htmlFile);
        const processedHtml = this.processHtmlForPreview(htmlContent);
        
        const previewFrame = document.getElementById('preview-frame');
        const blob = new Blob([processedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        previewFrame.src = url;
        this.hidePreviewPlaceholder();
        
        // Clean up old blob URL
        previewFrame.onload = () => {
            URL.revokeObjectURL(url);
        };
    }

    findHtmlFile() {
        const htmlFiles = Array.from(this.files.keys()).filter(filename => 
            filename.toLowerCase().endsWith('.html')
        );
        
        // Prefer index.html
        return htmlFiles.find(f => f.toLowerCase().includes('index')) || htmlFiles[0];
    }

    processHtmlForPreview(htmlContent) {
        let processedHtml = htmlContent;
        
        // Inject CSS files
        const cssFiles = Array.from(this.files.keys()).filter(filename => 
            filename.toLowerCase().endsWith('.css')
        );
        
        cssFiles.forEach(cssFile => {
            const cssContent = this.files.get(cssFile);
            const styleTag = `<style>/* ${cssFile} */\n${cssContent}\n</style>`;
            
            // Try to inject before </head>, otherwise at the beginning
            if (processedHtml.includes('</head>')) {
                processedHtml = processedHtml.replace('</head>', `${styleTag}\n</head>`);
            } else {
                processedHtml = styleTag + '\n' + processedHtml;
            }
        });
        
        // Inject JavaScript files
        const jsFiles = Array.from(this.files.keys()).filter(filename => 
            filename.toLowerCase().endsWith('.js')
        );
        
        jsFiles.forEach(jsFile => {
            const jsContent = this.files.get(jsFile);
            const scriptTag = `<script>/* ${jsFile} */\n${jsContent}\n</script>`;
            
            // Try to inject before </body>, otherwise at the end
            if (processedHtml.includes('</body>')) {
                processedHtml = processedHtml.replace('</body>', `${scriptTag}\n</body>`);
            } else {
                processedHtml = processedHtml + '\n' + scriptTag;
            }
        });
        
        return processedHtml;
    }

    openPreviewInNewTab() {
        const htmlFile = this.findHtmlFile();
        if (!htmlFile) {
            this.logWarning('No HTML file found to preview');
            return;
        }

        const htmlContent = this.files.get(htmlFile);
        const processedHtml = this.processHtmlForPreview(htmlContent);
        
        const blob = new Blob([processedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
        
        // Clean up after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // Layout Management
    setLayout(layout) {
        this.currentLayout = layout;
        const container = document.getElementById('main-container');
        const editorSection = document.getElementById('editor-section');
        const previewSection = document.getElementById('preview-section');
        
        // Remove all layout classes
        container.className = 'main-container';
        editorSection.classList.remove('hidden');
        previewSection.classList.remove('hidden');
        
        // Update layout buttons
        document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`layout-${layout}`).classList.add('active');
        
        // Apply new layout
        switch (layout) {
            case 'split':
                container.classList.add('layout-split');
                break;
            case 'vertical':
                container.classList.add('layout-vertical');
                break;
            case 'horizontal':
                container.classList.add('layout-horizontal');
                break;
            case 'preview':
                container.classList.add('layout-preview-only');
                editorSection.classList.add('hidden');
                break;
            case 'editor':
                container.classList.add('layout-editor-only');
                previewSection.classList.add('hidden');
                break;
        }
        
        // Trigger editor resize
        if (this.editor) {
            setTimeout(() => this.editor.layout(), 100);
        }
    }

    // Code Execution
    runCode() {
        if (!this.currentFile) {
            this.logWarning('No file selected to run');
            return;
        }

        const content = this.files.get(this.currentFile);
        if (!content || !content.trim()) {
            this.logWarning('File is empty');
            return;
        }

        this.logInfo(`Running ${this.currentFile}...`);
        
        const language = this.getFileLanguage(this.currentFile);
        
        try {
            if (language === 'javascript') {
                this.executeJavaScript(content);
            } else if (language === 'html') {
                this.updatePreview();
                this.logSuccess('HTML rendered in preview');
            } else {
                this.logInfo(`Preview updated for ${language} file`);
                this.updatePreview();
            }
        } catch (error) {
            this.logError(`Execution error: ${error.message}`);
        }
    }

    executeJavaScript(code) {
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
        };
        
        const outputs = [];
        
        // Override console methods
        console.log = (...args) => {
            outputs.push({ type: 'success', message: args.join(' ') });
            originalConsole.log(...args);
        };
        console.error = (...args) => {
            outputs.push({ type: 'error', message: args.join(' ') });
            originalConsole.error(...args);
        };
        console.warn = (...args) => {
            outputs.push({ type: 'warning', message: args.join(' ') });
            originalConsole.warn(...args);
        };
        console.info = (...args) => {
            outputs.push({ type: 'info', message: args.join(' ') });
            originalConsole.info(...args);
        };
        
        try {
            // Execute code in a new function scope
            const fn = new Function(code);
            fn();
            
            if (outputs.length === 0) {
                this.logSuccess('JavaScript executed successfully (no output)');
            } else {
                outputs.forEach(output => {
                    this[`log${output.type.charAt(0).toUpperCase() + output.type.slice(1)}`](output.message);
                });
            }
        } catch (error) {
            this.logError(`JavaScript Error: ${error.message}`);
        } finally {
            // Restore console methods
            Object.assign(console, originalConsole);
        }
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        
        if (this.editor) {
            monaco.editor.setTheme(this.theme === 'dark' ? 'vs-dark' : 'vs');
        }
        
        this.logInfo(`Switched to ${this.theme} theme`);
    }

    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.theme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-color-scheme', this.theme);
                if (this.editor) {
                    monaco.editor.setTheme(this.theme === 'dark' ? 'vs-dark' : 'vs');
                }
            });
        }
    }

    // Modal Management
    showNewFileModal() {
        document.getElementById('new-file-name').value = '';
        document.getElementById('file-language').value = 'html';
        this.showModal('new-file-modal');
        setTimeout(() => document.getElementById('new-file-name').focus(), 100);
    }

    showTemplateModal() {
        this.populateTemplateGrid();
        this.selectedTemplate = null; // Reset selection
        this.showModal('template-modal');
    }

    populateTemplateGrid() {
        const grid = document.getElementById('template-grid');
        grid.innerHTML = '';
        
        this.templates.forEach((template, id) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.setAttribute('data-template', id);
            
            const fileCount = template.files.size;
            const fileTypes = Array.from(template.files.keys()).map(f => f.split('.').pop()).join(', ');
            
            card.innerHTML = `
                <div class="template-card__header">
                    <div class="template-card__icon">${template.icon}</div>
                    <div class="template-card__info">
                        <h4>${template.name}</h4>
                    </div>
                </div>
                <div class="template-card__description">${template.description}</div>
                <div class="template-card__features">
                    <span class="template-feature">${fileCount} files</span>
                    <span class="template-feature">${fileTypes}</span>
                </div>
            `;
            
            card.addEventListener('click', () => this.selectTemplate(card, id));
            grid.appendChild(card);
        });
    }

    selectTemplate(card, templateId) {
        // Remove selection from all cards
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        // Add selection to clicked card
        card.classList.add('selected');
        this.selectedTemplate = templateId;
        
        this.logInfo(`Selected template: ${this.templates.get(templateId).name}`);
    }

    useSelectedTemplate() {
        if (!this.selectedTemplate) {
            alert('Please select a template first');
            return;
        }
        
        const template = this.templates.get(this.selectedTemplate);
        
        // Clear current files and tabs
        this.files.clear();
        this.clearAllTabs();
        
        // Load template files
        template.files.forEach((content, filename) => {
            this.files.set(filename, content);
        });
        
        this.updateFileExplorer();
        
        // Open the first file (preferably index.html)
        const htmlFile = Array.from(this.files.keys()).find(f => f.includes('index.html'));
        const firstFile = htmlFile || Array.from(this.files.keys())[0];
        
        if (firstFile) {
            this.openFile(firstFile);
        }
        
        this.hideModal('template-modal');
        this.logSuccess(`Template "${template.name}" loaded successfully`);
        this.updatePreview();
    }

    showShareModal() {
        const shareUrl = this.generateShareUrl();
        document.getElementById('share-url').value = shareUrl;
        this.showModal('share-modal');
    }

    showExportModal() {
        this.showModal('export-modal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // File Operations
    createNewFile() {
        const filename = document.getElementById('new-file-name').value.trim();
        const language = document.getElementById('file-language').value;
        
        if (!filename) {
            alert('Please enter a filename');
            return;
        }
        
        if (this.files.has(filename)) {
            alert('File already exists!');
            return;
        }
        
        const defaultContent = this.getDefaultContent(language, filename);
        this.files.set(filename, defaultContent);
        
        this.updateFileExplorer();
        this.openFile(filename);
        this.hideModal('new-file-modal');
        
        this.logSuccess(`Created new file: ${filename}`);
    }

    getDefaultContent(language, filename) {
        const templates = {
            'html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>`,
            'css': `/* CSS styles */

body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}`,
            'javascript': `// JavaScript code

console.log('Hello, World!');

document.addEventListener('DOMContentLoaded', function() {
    // Your code here
});`,
            'json': `{
    "name": "My Project",
    "version": "1.0.0",
    "description": "A new project"
}`,
            'markdown': `# ${filename.replace('.md', '')}

This is a markdown file.

## Features

- Feature 1
- Feature 2
- Feature 3`,
            'python': `#!/usr/bin/env python3
"""
${filename} - A Python script
"""

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
            'plaintext': 'New text file'
        };
        
        return templates[language] || templates['plaintext'];
    }

    deleteFile(filename) {
        if (confirm(`Delete ${filename}?`)) {
            this.files.delete(filename);
            this.closeTab(filename);
            this.updateFileExplorer();
            this.logInfo(`Deleted file: ${filename}`);
            
            // Update preview if HTML file was deleted
            if (filename.toLowerCase().endsWith('.html')) {
                this.updatePreview();
            }
        }
    }

    // Sharing and Export
    generateShareUrl() {
        const projectData = {
            name: this.projectName,
            files: Object.fromEntries(this.files),
            timestamp: Date.now()
        };
        
        const encoded = btoa(JSON.stringify(projectData));
        return `${window.location.origin}${window.location.pathname}?project=${encoded}`;
    }

    copyShareLink() {
        const shareUrl = document.getElementById('share-url').value;
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.logSuccess('Share link copied to clipboard');
        }).catch(() => {
            this.logError('Failed to copy link');
        });
    }

    shareOnSocial(platform) {
        const shareUrl = document.getElementById('share-url').value;
        const text = `Check out my code project: ${this.projectName}`;
        
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`
        };
        
        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    }

    exportAsZip() {
        // Create a simple ZIP-like structure (for demo purposes)
        const files = Array.from(this.files.entries());
        let zipContent = '';
        
        files.forEach(([filename, content]) => {
            zipContent += `\n=== ${filename} ===\n${content}\n`;
        });
        
        this.downloadFile(`${this.projectName}.txt`, zipContent);
        this.logSuccess('Project exported as text file');
        this.hideModal('export-modal');
    }

    exportAsHtml() {
        const htmlFile = this.findHtmlFile();
        if (!htmlFile) {
            alert('No HTML file found to export');
            return;
        }
        
        const htmlContent = this.files.get(htmlFile);
        const processedHtml = this.processHtmlForPreview(htmlContent);
        
        this.downloadFile(`${this.projectName}.html`, processedHtml);
        this.logSuccess('Project exported as HTML file');
        this.hideModal('export-modal');
    }

    exportToCodePen() {
        const htmlFile = this.findHtmlFile();
        const cssFiles = Array.from(this.files.keys()).filter(f => f.endsWith('.css'));
        const jsFiles = Array.from(this.files.keys()).filter(f => f.endsWith('.js'));
        
        const html = htmlFile ? this.files.get(htmlFile) : '';
        const css = cssFiles.map(f => this.files.get(f)).join('\n\n');
        const js = jsFiles.map(f => this.files.get(f)).join('\n\n');
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define';
        form.target = '_blank';
        
        const data = JSON.stringify({
            title: this.projectName,
            html: html,
            css: css,
            js: js
        });
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = data;
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        this.hideModal('export-modal');
        this.logSuccess('Project opened in CodePen');
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Command Palette
    setupCommandPalette() {
        // Show command palette on Ctrl+Shift+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.showCommandPalette();
            }
        });
    }

    showCommandPalette() {
        this.populateCommandList();
        this.showModal('command-palette');
        setTimeout(() => document.getElementById('command-input').focus(), 100);
    }

    populateCommandList() {
        const list = document.getElementById('command-list');
        list.innerHTML = '';
        
        this.commands.forEach((command, index) => {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.setAttribute('data-index', index);
            
            item.innerHTML = `
                <span class="command-name">${command.name}</span>
                <span class="command-shortcut">${command.shortcut}</span>
            `;
            
            item.addEventListener('click', () => {
                command.action();
                this.hideModal('command-palette');
            });
            
            list.appendChild(item);
        });
    }

    filterCommands(query) {
        const items = document.querySelectorAll('.command-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.command-name').textContent.toLowerCase();
            if (name.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleCommandInput(e) {
        const items = Array.from(document.querySelectorAll('.command-item')).filter(item => 
            item.style.display !== 'none'
        );
        
        if (e.key === 'Enter' && items.length > 0) {
            const selected = items.find(item => item.classList.contains('selected')) || items[0];
            selected.click();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateCommandList(e.key === 'ArrowDown' ? 1 : -1, items);
        } else if (e.key === 'Escape') {
            this.hideModal('command-palette');
        }
    }

    navigateCommandList(direction, items) {
        const current = items.findIndex(item => item.classList.contains('selected'));
        
        items.forEach(item => item.classList.remove('selected'));
        
        let newIndex;
        if (current === -1) {
            newIndex = direction === 1 ? 0 : items.length - 1;
        } else {
            newIndex = (current + direction + items.length) % items.length;
        }
        
        if (items[newIndex]) {
            items[newIndex].classList.add('selected');
            items[newIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'n':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        this.showNewFileModal();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    this.runCode();
                    break;
                case 't':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        this.toggleTheme();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    this.showShareModal();
                    break;
                case 'e':
                    e.preventDefault();
                    this.showExportModal();
                    break;
                case 'k':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        this.clearConsole();
                    }
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
                this.hideModal(modal.id);
            });
        }
    }

    // Console Management
    logSuccess(message) {
        this.addConsoleMessage(message, 'success');
    }

    logError(message) {
        this.addConsoleMessage(message, 'error');
    }

    logWarning(message) {
        this.addConsoleMessage(message, 'warning');
    }

    logInfo(message) {
        this.addConsoleMessage(message, 'info');
    }

    addConsoleMessage(message, type = 'info') {
        const output = document.getElementById('console-output');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'console-message';
        
        const prompt = document.createElement('span');
        prompt.className = 'console-prompt';
        prompt.textContent = type === 'error' ? '✗' : 
                           type === 'success' ? '✓' : 
                           type === 'warning' ? '⚠' : '>';
        
        const text = document.createElement('span');
        text.className = `console-text console-${type}`;
        text.textContent = message;
        
        messageDiv.appendChild(prompt);
        messageDiv.appendChild(text);
        output.appendChild(messageDiv);
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }

    clearConsole() {
        const output = document.getElementById('console-output');
        output.innerHTML = `
            <div class="console-message">
                <span class="console-prompt">></span>
                <span class="console-text">Console cleared. Welcome to Online Code Editor!</span>
            </div>
        `;
    }

    // Utility Methods
    showEditorPlaceholder() {
        document.getElementById('editor-placeholder').classList.remove('hidden');
    }

    hideEditorPlaceholder() {
        document.getElementById('editor-placeholder').classList.add('hidden');
    }

    showPreviewPlaceholder() {
        document.getElementById('preview-placeholder').classList.remove('hidden');
    }

    hidePreviewPlaceholder() {
        document.getElementById('preview-placeholder').classList.add('hidden');
    }

    clearAllTabs() {
        this.openTabs.clear();
        document.getElementById('editor-tabs').innerHTML = '';
        this.currentFile = null;
        this.activeTab = null;
        this.showEditorPlaceholder();
    }

    updateProjectStatus() {
        // Update project status indicator
        const statusElement = document.getElementById('project-status');
        if (statusElement) {
            statusElement.title = `Project: ${this.projectName} (${this.files.size} files)`;
        }
    }

    handleGlobalClick(e) {
        // Handle global clicks for dropdowns, context menus, etc.
    }

    handleResize() {
        // Handle window resize
        if (this.editor) {
            this.editor.layout();
        }
    }
}

// Initialize the application
let codeEditor;

document.addEventListener('DOMContentLoaded', () => {
    codeEditor = new CodeEditor();
    
    // Make it globally accessible for debugging
    window.codeEditor = codeEditor;
    
    console.log('🚀 Online Code Editor initialized successfully');
});