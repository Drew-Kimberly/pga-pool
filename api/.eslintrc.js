module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    "prettier",
    "simple-import-sort"
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier-standard',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "no-use-before-define": "off",
    "no-useless-constructor": "off",
    "no-unused-vars": "off",
    "no-new": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto",
        "printWidth": 100,
        "semi": true,
        "singleQuote": true
      }
    ],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)"
          ],
          // Packages
          ["^\\w"],
          // Side effect imports.
          ["^\\u0000"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"]
        ]
      }
    ],
    "import/no-anonymous-default-export": [
      "error",
      {
        "allowArrowFunction": true,
        "allowAnonymousFunction": true
      }
    ]
  },
  globals: {
    NodeJS: true
  }
};
