const OpenAI = require('openai');
const { CohereClient } = require('cohere-ai');
const natural = require('natural');
const compromise = require('compromise');
const beautify = require('js-beautify');

class AICodeAssistant {
    constructor() {
        // Initialize OpenAI
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Initialize Cohere as backup
        this.cohere = new CohereClient({
            token: process.env.COHERE_API_KEY,
        });

        // NLP tools
        this.stemmer = natural.PorterStemmer;
        this.tokenizer = new natural.WordTokenizer();

        // Code analysis patterns
        this.errorPatterns = {
            javascript: [
                { pattern: /ReferenceError: (\w+) is not defined/, suggestion: 'Variable "{1}" is not declared. Consider using let, const, or var.' },
                { pattern: /SyntaxError: Unexpected token/, suggestion: 'Check for missing semicolons, brackets, or quotes.' },
                { pattern: /TypeError: Cannot read property/, suggestion: 'Check if object exists before accessing properties. Use optional chaining (?.)'  },
                { pattern: /TypeError: (\w+) is not a function/, suggestion: 'Variable "{1}" is not a function. Check the variable name.' }
            ],
            python: [
                { pattern: /NameError: name '(\w+)' is not defined/, suggestion: 'Variable "{1}" is not defined. Declare it first.' },
                { pattern: /IndentationError/, suggestion: 'Python requires consistent indentation. Use 4 spaces consistently.' },
                { pattern: /SyntaxError: invalid syntax/, suggestion: 'Check for missing colons, parentheses, or incorrect syntax.' },
                { pattern: /TypeError: unsupported operand type/, suggestion: 'Incompatible types for operation. Check variable types.' }
            ]
        };

        // Code templates for suggestions
        this.templates = {
            javascript: {
                function: `function {name}({params}) {
    // TODO: Implement function logic
    return;
}`,
                asyncFunction: `async function {name}({params}) {
    try {
        // TODO: Implement async logic
        return;
    } catch (error) {
        console.error("Error:", error);
    }
}`,
                class: `class {name} {
    constructor({params}) {
        // TODO: Initialize properties
    }

    // TODO: Add methods
}`,
                eventListener: `addEventListener("{event}", function(e) {
    // TODO: Handle event
});`,
                fetchAPI: `fetch("{url}")
    .then(response => response.json())
    .then(data => {
        // TODO: Handle data
    })
    .catch(error => {
        console.error("Error:", error);
    });`
            },
            python: {
                function: `def {name}({params}):
    """
    TODO: Add function description
    """
    pass`,
                class: `class {name}:
    def __init__(self{params}):
        """
        TODO: Initialize class
        """
        pass`,
                tryExcept: `try:
    # TODO: Add code that might raise an exception
    pass
except Exception as e:
    print(f"Error: {e}")
    # TODO: Handle the exception`,
                withStatement: `with open("{filename}", "r") as file:
    # TODO: Process file
    content = file.read()`,
                listComprehension: `[{expression} for {item} in {iterable} if {condition}]`
            }
        };
    }

    // Main AI code completion method
    async getCodeCompletion(code, language, position, context = '') {
        try {
            const prompt = this.buildCompletionPrompt(code, language, position, context);

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert ${language} developer. Provide intelligent code completions that are contextually appropriate, follow best practices, and are syntactically correct. Only return the completion code, no explanations.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.3,
                stop: ['\n\n']
            });

            const completion = response.choices[0]?.message?.content?.trim() || '';

            return {
                suggestions: this.parseCompletionResponse(completion, language),
                confidence: this.calculateConfidence(completion, code, language)
            };

        } catch (error) {
            console.error('AI completion error:', error);
            // Fallback to rule-based suggestions
            return this.getRuleBasedSuggestions(code, language, position);
        }
    }

    // AI-powered error analysis and fixing
    async analyzeAndFixError(code, errorMessage, language) {
        try {
            const prompt = `Analyze this ${language} code error and provide a solution:

Code:
\`\`\`${language}
${code}
\`\`\`

Error: ${errorMessage}

Respond with JSON format:
{
  "explanation": "Clear explanation of the error",
  "fixedCode": "Corrected code here",
  "bestPractices": ["Practice 1", "Practice 2"]
}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert debugging assistant. Provide clear, actionable solutions.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.2
            });

            const aiResponse = response.choices[0]?.message?.content;

            try {
                const parsedResponse = JSON.parse(aiResponse);
                return {
                    success: true,
                    ...parsedResponse
                };
            } catch (parseError) {
                return {
                    success: true,
                    explanation: aiResponse,
                    fixedCode: code,
                    bestPractices: ['Follow language best practices', 'Test your code thoroughly']
                };
            }

        } catch (error) {
            console.error('AI error analysis failed:', error);
            return this.getPatternBasedErrorFix(code, errorMessage, language);
        }
    }

    // AI code explanation
    async explainCode(code, language) {
        try {
            const prompt = `Explain this ${language} code clearly and concisely:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. What the code does overall
2. Key concepts used
3. Potential improvements`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a patient coding teacher. Explain code clearly and help users understand.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 400,
                temperature: 0.4
            });

            return {
                explanation: response.choices[0]?.message?.content || 'Unable to explain code at this time.'
            };

        } catch (error) {
            console.error('AI explanation error:', error);
            return {
                explanation: 'This code performs operations in ' + language + '. AI explanation service is currently unavailable.'
            };
        }
    }

    // AI code optimization
    async optimizeCode(code, language) {
        try {
            const prompt = `Review and optimize this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Focus on:
1. Performance improvements
2. Code readability  
3. Best practices
4. Security considerations

Provide optimized code and explain changes.`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert code reviewer. Suggest practical optimizations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.3
            });

            const aiResponse = response.choices[0]?.message?.content || '';

            return {
                optimizedCode: this.extractCodeFromResponse(aiResponse, language),
                suggestions: this.extractSuggestionsFromResponse(aiResponse),
                explanation: aiResponse
            };

        } catch (error) {
            console.error('AI optimization error:', error);
            return {
                optimizedCode: code,
                suggestions: ['Use const/let instead of var', 'Add error handling', 'Use descriptive names'],
                explanation: 'AI optimization service is currently unavailable.'
            };
        }
    }

    // AI chat assistant
    async chatAssistant(message, codeContext = '', language = '') {
        try {
            let prompt = message;

            if (codeContext) {
                prompt = `I'm working with this ${language} code:

\`\`\`${language}
${codeContext}
\`\`\`

Question: ${message}`;
            }

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful coding assistant. Provide clear, practical advice and code examples.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.6
            });

            return {
                response: response.choices[0]?.message?.content || 'Sorry, I could not process your request.',
                suggestions: this.extractActionableSuggestions(response.choices[0]?.message?.content || '')
            };

        } catch (error) {
            console.error('AI chat error:', error);
            return {
                response: 'AI assistant is currently unavailable. Please try again later.',
                suggestions: []
            };
        }
    }

    // Generate documentation
    async generateDocumentation(code, language) {
        try {
            const prompt = `Generate documentation for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include function descriptions, parameters, return values, and usage examples.`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical documentation expert. Generate clear, comprehensive docs.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 400,
                temperature: 0.3
            });

            return {
                documentation: response.choices[0]?.message?.content || 'Documentation generation failed.',
                formattedCode: this.addDocumentationToCode(code, response.choices[0]?.message?.content, language)
            };

        } catch (error) {
            console.error('AI documentation error:', error);
            return {
                documentation: 'Unable to generate documentation.',
                formattedCode: code
            };
        }
    }

    // Smart code refactoring suggestions
    async suggestRefactoring(code, language) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior developer. Suggest practical refactoring improvements for better code quality.'
                    },
                    {
                        role: 'user',
                        content: `Analyze this ${language} code for refactoring opportunities:\n\n\`\`\`${language}\n${code}\n\`\`\``
                    }
                ],
                max_tokens: 300,
                temperature: 0.4
            });

            const suggestions = response.choices[0]?.message?.content || '';

            return {
                suggestions: this.extractSuggestionsFromResponse(suggestions),
                explanation: suggestions,
                priority: this.categorizeSuggestions(suggestions)
            };

        } catch (error) {
            console.error('Refactoring suggestion error:', error);
            return {
                suggestions: ['Extract functions for better modularity', 'Use meaningful variable names', 'Add input validation'],
                explanation: 'AI refactoring suggestions unavailable.',
                priority: { high: [], medium: [], low: [] }
            };
        }
    }

    // Helper methods
    buildCompletionPrompt(code, language, position, context) {
        const beforeCursor = code.substring(0, position);
        const afterCursor = code.substring(position);

        return `Complete this ${language} code at cursor position:

Before cursor:
${beforeCursor}

After cursor:
${afterCursor}

Context: ${context}

Provide only the code completion that fits at the cursor position.`;
    }

    parseCompletionResponse(response, language) {
        const suggestions = [];

        // Clean up the response
        let cleanResponse = response.trim();

        // Remove markdown code blocks if present
        if (cleanResponse.includes('```')) {
            const codeMatch = cleanResponse.match(/```[\w]*\n?([\s\S]*?)```/);
            if (codeMatch) {
                cleanResponse = codeMatch[1].trim();
            }
        }

        // Remove inline code backticks
        cleanResponse = cleanResponse.replace(/`([^`]+)`/g, '$1');

        if (cleanResponse) {
            suggestions.push({
                text: cleanResponse,
                type: 'completion',
                confidence: 0.8
            });
        }

        return suggestions;
    }

    getRuleBasedSuggestions(code, language, position) {
        const suggestions = [];
        const beforeCursor = code.substring(0, position).toLowerCase();
        const templates = this.templates[language] || {};

        // Language-specific rule-based suggestions
        if (language === 'javascript') {
            if (beforeCursor.includes('function')) {
                suggestions.push({ text: templates.function || 'function name() {}', type: 'template' });
            }
            if (beforeCursor.includes('if')) {
                suggestions.push({ text: 'if (condition) {\n    // TODO\n}', type: 'template' });
            }
            if (beforeCursor.includes('for')) {
                suggestions.push({ text: 'for (let i = 0; i < length; i++) {\n    // TODO\n}', type: 'template' });
            }
        } else if (language === 'python') {
            if (beforeCursor.includes('def')) {
                suggestions.push({ text: templates.function || 'def name():\n    pass', type: 'template' });
            }
            if (beforeCursor.includes('if')) {
                suggestions.push({ text: 'if condition:\n    pass', type: 'template' });
            }
            if (beforeCursor.includes('for')) {
                suggestions.push({ text: 'for item in items:\n    pass', type: 'template' });
            }
        }

        return { suggestions, confidence: 0.3 };
    }

    getPatternBasedErrorFix(code, errorMessage, language) {
        const patterns = this.errorPatterns[language] || [];

        for (const pattern of patterns) {
            const match = errorMessage.match(pattern.pattern);
            if (match) {
                let suggestion = pattern.suggestion;
                // Replace placeholders
                for (let i = 1; i < match.length; i++) {
                    suggestion = suggestion.replace(`{${i}}`, match[i]);
                }

                return {
                    success: true,
                    explanation: suggestion,
                    fixedCode: code,
                    bestPractices: ['Use linters', 'Write tests', 'Follow conventions']
                };
            }
        }

        return {
            success: false,
            explanation: 'Unable to auto-diagnose. Check syntax and logic.',
            fixedCode: code,
            bestPractices: ['Review error message', 'Check for typos']
        };
    }

    extractCodeFromResponse(response, language) {
        const codeMatch = response.match(new RegExp(`\`\`\`${language}([\s\S]*?)\`\`\``));
        if (codeMatch) return codeMatch[1].trim();

        const genericCodeMatch = response.match(/\`\`\`([\s\S]*?)\`\`\`/);
        if (genericCodeMatch) return genericCodeMatch[1].trim();

        return response;
    }

    extractSuggestionsFromResponse(response) {
        const lines = response.split('\n');
        const suggestions = lines
            .filter(line => line.trim().match(/^[\d\-\*]|^-/))
            .map(line => line.replace(/^[\d\-\*\.\s]+/, '').trim())
            .filter(suggestion => suggestion.length > 0);

        return suggestions.length > 0 ? suggestions : ['Review code structure', 'Consider refactoring'];
    }

    extractActionableSuggestions(response) {
        const actionWords = ['try', 'consider', 'use', 'avoid', 'check', 'ensure', 'add', 'remove'];
        const sentences = response.split(/[.!?]+/);

        return sentences
            .filter(sentence => actionWords.some(word => sentence.toLowerCase().includes(word)))
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 10)
            .slice(0, 3);
    }

    addDocumentationToCode(code, documentation, language) {
        const docComment = language === 'python' 
            ? '"""\n' + documentation + '\n"""\n\n' 
            : '/**\n * ' + documentation.replace(/\n/g, '\n * ') + '\n */\n\n';
        return docComment + code;
    }

    categorizeSuggestions(suggestions) {
        const priority = { high: [], medium: [], low: [] };
        const highPriorityKeywords = ['security', 'performance', 'error', 'bug'];
        const mediumPriorityKeywords = ['readability', 'maintainability', 'structure'];

        suggestions.split('\n').forEach(suggestion => {
            const lower = suggestion.toLowerCase();
            if (highPriorityKeywords.some(keyword => lower.includes(keyword))) {
                priority.high.push(suggestion.trim());
            } else if (mediumPriorityKeywords.some(keyword => lower.includes(keyword))) {
                priority.medium.push(suggestion.trim());
            } else if (suggestion.trim()) {
                priority.low.push(suggestion.trim());
            }
        });

        return priority;
    }

    calculateConfidence(completion, originalCode, language) {
        let confidence = 0.5;

        if (completion.includes('{') && completion.includes('}')) confidence += 0.1;
        if (completion.includes(';') && language === 'javascript') confidence += 0.1;
        if (completion.includes(':') && language === 'python') confidence += 0.1;
        if (completion.length > 10 && completion.length < 200) confidence += 0.1;

        return Math.min(confidence, 0.9);
    }
}

module.exports = AICodeAssistant;