import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginA11y from 'eslint-plugin-vuejs-accessibility'
import vueTsConfigs from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

import divBudget from './eslint-rules/div-budget.js'

/** Locally defined rules that encode this project's own conventions. */
const local = {
  rules: { 'div-budget': divBudget },
}

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...pluginA11y.configs['flat/recommended'],
  ...vueTsConfigs(),
  skipFormatting,

  {
    files: ['**/*.{ts,vue}'],
    plugins: { local },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // --- Semantic HTML -----------------------------------------------------
      // The project's stated goal is markup a reviewer can read. These rules
      // are what stops that goal from decaying into a div soup.

      'local/div-budget': ['error', { max: 4 }],

      // Elements that carry no meaning and have a semantic replacement.
      'vue/no-restricted-html-elements': [
        'error',
        { element: 'b', message: 'Use <strong> for importance, or CSS for weight alone.' },
        { element: 'i', message: 'Use <em> for emphasis, or CSS for italics alone.' },
        { element: 'center', message: 'Obsolete. Center with CSS.' },
        { element: 'font', message: 'Obsolete. Style with CSS.' },
        { element: 'marquee', message: 'Obsolete.' },
      ],

      // A11y rules the plugin ships as warnings but that this project treats
      // as errors, plus the ones most relevant to a data-heavy dashboard.
      'vuejs-accessibility/no-static-element-interactions': 'error',
      'vuejs-accessibility/click-events-have-key-events': 'error',
      'vuejs-accessibility/form-control-has-label': 'error',
      'vuejs-accessibility/label-has-for': [
        'error',
        { required: { some: ['nesting', 'id'] } },
      ],
      'vuejs-accessibility/heading-has-content': 'error',
      'vuejs-accessibility/anchor-has-content': 'error',
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/role-has-required-aria-props': 'error',
      // `role="list"` on a <ul> is redundant per the spec, but Safari drops
      // list semantics as soon as `list-style: none` is applied, so VoiceOver
      // stops announcing "list, 5 items". The role is the accepted workaround
      // and is required by this project's conventions, so it is allowed here.
      'vuejs-accessibility/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
      'vuejs-accessibility/no-autofocus': 'error',
      'vuejs-accessibility/tabindex-no-positive': 'error',
      'vuejs-accessibility/mouse-events-have-key-events': 'error',

      // --- Architecture ------------------------------------------------------
      // Decisions from frontend/CLAUDE.md, enforced by the build rather than
      // by anyone remembering them.

      'vue/component-api-style': ['error', ['script-setup']],
      'vue/multi-word-component-names': 'error',
      'vue/require-typed-ref': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/no-unused-properties': ['error', { groups: ['props'] }],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],
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

  {
    // The app shell owns the page landmarks and legitimately needs its own
    // layout wrappers.
    files: ['src/App.vue'],
    rules: { 'local/div-budget': ['error', { max: 6 }] },
  },

  {
    // A loading skeleton is the one honest use of meaningless boxes: each one
    // stands for content that does not exist yet, so no element carries its
    // meaning. The rule's premise does not apply here — and nowhere else.
    files: ['src/components/molecules/OverviewSkeleton.vue'],
    rules: { 'local/div-budget': ['error', { max: 8 }] },
  },

  {
    // The rule implementation itself runs in Node, not the browser.
    files: ['eslint-rules/**/*.js', '*.config.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
  },
]
