module.exports = {
  extends: ['./node_modules/@rennalabs/tsconfig'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    // react always is in scope in nextjs
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-void': 'off',
    'max-len': 'off',
  },
};
