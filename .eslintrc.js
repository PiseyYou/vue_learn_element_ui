module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    indent: ['off', 2],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
<<<<<<< HEAD
    'camelcase': 0
    // "camelcase": ["error", {
    //   "allow": ["aa_bb"]
    // }]
=======
    "camelcase": [1, {
      "properties": "never"
    }]
>>>>>>> goods_list
  }
}
