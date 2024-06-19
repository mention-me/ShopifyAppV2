

export type Environment = "production" | "demo" | "local";

export const isValidEnvironment = (env: any): env is Environment => {
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

export const parseShopifyId = (id: string) => {
	const idParts = id.split("/");
	return idParts[idParts.length - 1];
};
