const reactAll = require("eslint-plugin-react/configs/all");

const globals = require("globals");
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

const eslintPluginReactHooks = require("eslint-plugin-react-hooks");
const { fixupPluginRules } = require("@eslint/compat");


module.exports = tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	reactAll,

	{
		files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: true,
			},
			globals: {
				...globals.browser,
			},
		},
		settings: { react: { version: "detect" } },
		plugins: {
			"react-hooks": fixupPluginRules(eslintPluginReactHooks),
		},
		rules: {
			...eslintPluginReactHooks.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react/jsx-uses-react": "off",
			"react/jsx-wrap-multilines": "off",
			"react/jsx-indent": "off",
			"react/jsx-indent-props": "off",
			"react/jsx-max-depth": "off",
			"react/jsx-no-bind": "off",
			"react/jsx-newline": "off",
			"react/jsx-filename-extension": "off",
			"react/jsx-closing-bracket-location": "off",
			"react/function-component-definition": [
				2,
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function",
				},
			],
			"react/jsx-closing-tag-location": "off",
			"react/jsx-first-prop-new-line": "off",
			"react/jsx-no-leaked-render": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/no-floating-promises": "off",
			/*
			 * Something puzzling here. We're getting these rules thrown up a lot on all the fetch of our API calls.
			 */
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",

		},
	},
	{
		ignores: ["**/dist/", ".api/", "eslint.config.js", ".graphqlrc.js"],
	},
);
