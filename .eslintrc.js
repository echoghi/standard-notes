module.exports = {
    extends: ['next/core-web-vitals', 'airbnb', 'airbnb/hooks', 'prettier'],
    plugins: ['react', '@typescript-eslint', 'prettier', 'import'],
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 13,
        sourceType: 'module'
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/prefer-default-export': 'off',
        'no-param-reassign': 'off',
        // turn on errors for missing imports
        'import/no-unresolved': 'error',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never'
            }
        ],
        'consistent-return': 'off',
        'no-restricted-syntax': 'off',
        camelcase: 'off',
        'arrow-body-style': 'off',
        'no-undef': 'off',
        'prefer-arrow-callback': 'off',
        'react/jsx-filename-extension': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function'
            }
        ],
        'prettier/prettier': 'off'
    }
};
