export type Environment = "production" | "demo" | "local";

export const isValidEnvironment = (env: unknown): env is Environment => {
	if (!env || typeof env !== "string") {
		return false;
	}

	const validEnvironments: Environment[] = ["production", "demo", "local"];

	return validEnvironments.includes(env as Environment);
}

export const getDomainForEnvironment = (environment: Environment): string => {
	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
	} else if (environment === "local") {
		url = "mentionme.dev";
	}

	return url;
}

/**
 * Check if a string is a valid email address.
 *
 * While Shopify does semantically validate, it doesn't actually do any error checking.
 *
 * After reading the debate in
 * https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript we
 * decided to go with a simple regex check.
 *
 * @param email
 */
export const isValidEmail = (email: string): boolean => {
	return /^\S+@\S+$/.test(email)
}

export const parseShopifyId = (id: string) => {
	const idParts = id.split("/");
	return idParts[idParts.length - 1];
};

/**
 * Try and choose a locale to use for the Mention Me API.
 *
 * @param language
 * @param fallbackLocale comes from useSettings so could be all sorts of values.
 */
export const chooseLocale = (language: string, fallbackLocale: string | number | boolean) => {
	if (language.length === 5 && /^[a-z]{2}[-_][a-z]{2}$/i.test(language)) {
		return language;
	}

	if (typeof fallbackLocale === "string" && fallbackLocale.length === 5 && /^[a-z]{2}[-_][a-z]{2}$/i.test(fallbackLocale)) {
		return fallbackLocale;
	}

	throw new Error(`Invalid language from Shopify [${language}] and no valid fallback locale [${fallbackLocale}].`);
}
