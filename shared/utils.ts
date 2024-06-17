

export type Environment = "production" | "demo" | "local";

export const isValidEnvironment = (env: any): env is Environment => {
	if (!env || typeof env !== "string") {
		return false;
	}

	const validEnvironments: Environment[] = ["production", "demo", "local"];

	return validEnvironments.includes(env as Environment);
}

export const parseShopifyId = (id: string) => {
	const idParts = id.split("/");
	return idParts[idParts.length - 1];
};
