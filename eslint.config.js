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
		},
	},
	{
		ignores: ["**/dist/", ".api/", "eslint.config.js", ".graphqlrc.js"],
	},
);
