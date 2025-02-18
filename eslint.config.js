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
			semi: "warn",
			curly: "warn"
		}
	}
]