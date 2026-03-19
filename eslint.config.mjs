import eslint from '@eslint/js';
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import typescriptEslint from 'typescript-eslint';

/**
 * The lint configuration is intentionally opinionated:
 * - Type-aware TypeScript rules keep runtime mistakes from slipping through.
 * - JSDoc rules reinforce the user's request for beginner-friendly documentation.
 * - Unicorn prevents many shorthand and ambiguous naming patterns.
 * - Security and Sonar rules provide extra static analysis.
 */
export default typescriptEslint.config(
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'documentation/site/.docusaurus/**',
      'documentation/site/**/*.js',
      'documentation/site/**/*.mjs',
      'documentation/site/build/**',
      'documentation/site/static/api/**',
      'eslint.config.mjs',
      'node_modules/**',
      'src/types/**/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      ...typescriptEslint.configs.strictTypeChecked,
      ...typescriptEslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      jsdoc,
      security,
      sonarjs,
      unicorn,
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/require-description': 'error',
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {
            ClassDeclaration: true,
            FunctionDeclaration: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-property-description': 'error',
      'jsdoc/require-returns-description': 'error',
      'security/detect-object-injection': 'off',
      'sonarjs/cognitive-complexity': ['error', 18],
      'unicorn/no-array-for-each': 'error',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkDefaultAndNamespaceImports: true,
          checkShorthandImports: true,
          checkShorthandProperties: true,
          replacements: {
            args: {
              arguments: true,
            },
            params: {
              parameters: true,
            },
            props: {
              properties: true,
            },
          },
        },
      ],
    },
  },
);
