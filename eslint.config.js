import react from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	react.configs.recommended,

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
		},
	},
	{
		ignores: ["**/dist/", ".api/", "eslint.config.js", ".graphqlrc.js"],
	},
);
