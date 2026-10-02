import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**'
    ]
  },

  js.configs.recommended,

  {
    // Arquivos de configuração rodam no Node (ex.: vite.config.js)
    files: ['*.config.js'],
    languageOptions: {
      globals: globals.node
    }
  },

  {
    files: ['src/**/*.{js,jsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },

      globals: globals.browser
    },

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },

    rules: {
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true
        }
      ]
    }
  }
];
