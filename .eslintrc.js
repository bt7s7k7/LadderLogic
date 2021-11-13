module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "no-console": "warn",
        "no-debugger": "warn",
        "prefer-const": "off",
        "semi": ["warn", "never"],
        "prefer-rest-params": "off",
        "quotes": ["warn", "double", { "allowTemplateLiterals": true }],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/ban-types": "off"
    },
    ignorePatterns: [
        "/node_modules",
        "/build",
        "/dist",
        "/ucpem_ports",
    ]
}
