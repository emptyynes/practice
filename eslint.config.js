const tsParser = require("@typescript-eslint/parser");

module.exports = [
	{
		files: [
			'frontend/**/*.ts'
		],
		languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
			parser: tsParser,
			parserOptions: {
				requireConfigFile: false
			}
        },
		rules: {
			semi: ["warn", "never"],
			curly: ["warn", "all"],
			indent: ["warn", "tab", {
				SwitchCase: 1,
				ignoredNodes: ["ConditionalExpression"],
				ignoreComments: true
			}],
			"brace-style": ["warn", "1tbs", {
				allowSingleLine: false
			}]
		}
	}
]