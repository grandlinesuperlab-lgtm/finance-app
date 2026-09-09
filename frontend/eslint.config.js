import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import vueTsConfigs from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfigs(),
  skipFormatting,

  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // --- Architecture rules ------------------------------------------------
      // These encode decisions from frontend/CLAUDE.md so the build enforces
      // them instead of relying on anyone remembering.

      // Composition API with <script setup> only. No Options API.
      'vue/component-api-style': ['error', ['script-setup']],

      // Multi-word component names avoid clashing with native elements.
      'vue/multi-word-component-names': 'error',

      // Props and emits must be typed and explicit.
      'vue/require-typed-ref': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/no-unused-properties': ['error', { groups: ['props'] }],

      // Templates: order and structure that keeps diffs readable.
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],

      // v-html is an XSS vector; there is no case for it in this project.
      'vue/no-v-html': 'error',

      // --- General -----------------------------------------------------------
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
]
