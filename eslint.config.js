// eslint.config.js — ESLint flat config for browser vanilla JS
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script', // no ES modules — app.js runs directly in browser
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        requestAnimationFrame: 'readonly',
        prompt: 'readonly',
        Chart: 'readonly', // Chart.js loaded via CDN
      },
    },
    rules: {
      // Catch real bugs
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',

      // Code quality
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-implicit-coercion': 'warn',

      // Disable rules that don't apply to a large vanilla JS file
      'no-redeclare': 'off', // function re-declarations are intentional in some places
    },
  },
  {
    // Ignore generated/installed files
    ignores: ['node_modules/**'],
  },
];
