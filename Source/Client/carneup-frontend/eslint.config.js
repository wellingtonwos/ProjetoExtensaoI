import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // 1. Ignora a pasta de build (substitui o globalIgnores)
  { ignores: ['dist'] },

  // 2. Configuração principal
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Importa as regras recomendadas usando spread operator (substitui o 'extends')
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Regras recomendadas pelo Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // SUA REGRA CUSTOMIZADA MANTIDA AQUI:
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]