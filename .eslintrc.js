module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code quality
    'no-unused-vars': 'error',
    'no-console': 'off', // Allow console for debugging
    'no-debugger': 'warn',
    
    // Style preferences for game code
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    
    // Space Invaders specific - allow bitwise for pixel manipulation
    'no-bitwise': 'off',
    
    // Performance for game loop
    'no-loop-func': 'warn'
  },
  globals: {
    // Browser globals for space-invaders.html
    'requestAnimationFrame': 'readonly',
    'cancelAnimationFrame': 'readonly',
    'ImageData': 'readonly'
  }
};