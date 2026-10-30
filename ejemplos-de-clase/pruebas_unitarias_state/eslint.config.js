// @ts-check
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // --- Naming conventions ---
      '@typescript-eslint/naming-convention': [
        'error',
        // classes, interfaces, types, enums -> PascalCase
        { selector: 'typeLike', format: ['PascalCase'] },
        // enum members are constants -> UPPER_CASE
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        // true module-level constants (primitive, never reassigned) -> UPPER_CASE
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          types: ['boolean', 'string', 'number'],
          format: ['UPPER_CASE'],
        },
        // everything else variable/function/parameter-like -> camelCase
        { selector: 'variableLike', format: ['camelCase'], leadingUnderscore: 'allow' },
        // class members: methods, properties, accessors -> camelCase
        { selector: 'memberLike', format: ['camelCase'], leadingUnderscore: 'allow' },
      ],

      // --- No magic numbers: force meaningful named constants ---
      'no-magic-numbers': 'off', // superseded by the TS-aware version below
      '@typescript-eslint/no-magic-numbers': [
        'error',
        { ignoreArrayIndexes: true, ignoreReadonlyClassProperties: true },
      ],

      // --- Minimum identifier length (force meaningful names) ---
      'id-length': [
        'error',
        { min: 4, properties: 'never', exceptions: ['i', 'j', 'k'], exceptionPatterns: ['^_$'] },
      ],

      // --- Method / function size ---
      'max-lines-per-function': [
        'error',
        { max: 40, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],

      // --- Max line length ---
      '@stylistic/max-len': [
        'error',
        { code: 120, ignoreUrls: true, ignoreTemplateLiterals: true },
      ],

      // --- Mandatory curly braces on if/else/for/while/etc. ---
      curly: ['error', 'all'],

      // --- Space after `if`/`for`/`while`/... and before `(` ---
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],

      // --- No space just inside `( ... )` ---
      '@stylistic/space-in-parens': ['error', 'never'],

      // --- Space between `)` and `{` ---
      '@stylistic/space-before-blocks': ['error', 'always'],

      // --- OOP-specific rules ---

      // every field/method must declare public/private/protected -> explicit encapsulation
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

      // a method that never uses `this` is probably meant to be `static`
      'class-methods-use-this': 'off',
      '@typescript-eslint/class-methods-use-this': 'warn',

      // one class per file, matching the ClassName.ts file convention
      'max-classes-per-file': ['error', 1],

      // no empty stub bodies left behind (e.g. an empty constructor that does nothing)
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',

      // every function/method must declare its return type explicitly
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
);
