export type Environment = "production" | "demo" | "local";

export const isValidEnvironment = (env: unknown): env is Environment => {
	if (!env || typeof env !== "string") {
		return false;
	}

	const validEnvironments: Environment[] = ["production", "demo", "local"];

	return validEnvironments.includes(env as Environment);
}

/**
 * Get the domain to look up configuration from. For the "mention-me-checkout-extensibility-beta" store we override it
 * to use local environments.
 */
export const getDomainForEnvironment = (myshopifyDomain: string, environment: Environment): string => {
	if (myshopifyDomain === "mention-me-checkout-extensibility-beta.myshopify.com") {
		return "mentionme.dev";
	}

	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
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
