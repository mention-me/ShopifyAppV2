import { Environment, getDomainForEnvironment } from "../utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { APP_VERSION } from "../constants";
import debounce from "../debounce";
import { logError } from "../sentry";

export interface Image {
	url: string;
	width: number;
	height: number;
}

export interface MentionMeShopifyConfig {
	shopId?: string,
	environment?: Environment,
	partnerCode?: string,
	defaultLocale?: string,
	refereeBannerImage?: Image,
}

export type ExtensionType = "checkout" | "order-status"

interface Props {
	myshopifyDomain: string;
	extension: ExtensionType;
	currency: string;
	extensionLanguage: string;
	language: string;
	country?: string;
	marketId?: string;
	marketHandle?: string;
}

export const useMentionMeShopifyConfig = ({
											  myshopifyDomain,
											  extension,
											  extensionLanguage,
											  language,
											  currency,
											  country,
											  marketId,
											  marketHandle,
										  }: Props) => {

	const [mentionMeConfig, setMentionMeConfig] = useState<MentionMeShopifyConfig>({
		shopId: undefined,
		partnerCode: "",
		environment: null,
		defaultLocale: "",
	});

	const [loading, setLoading] = useState(true);

	const url = getDomainForEnvironment("production");

	const fetchMentionMeConfig = useCallback(async () => {
		const u = new URL(`https://${url}/shopify/app/config/${myshopifyDomain}`);
		u.searchParams.append("extensionLanguage", extensionLanguage);
		u.searchParams.append("language", language);
		u.searchParams.append("currency", currency);
		u.searchParams.append("country", country);
		u.searchParams.append("market", marketId);
		u.searchParams.append("marketHandle", marketHandle);
		u.searchParams.append("extension", extension);
		u.searchParams.append("version", APP_VERSION);

		try {
			const response = await fetch(u.toString(),
				{
					method: "GET",
					// mode: "no-cors",
					headers: { accept: "application/json" },
				},
			);

			if (!response.ok) {
				throw new Error("Could not retrieve config for shop");
			}

			const json = await response.json() as MentionMeShopifyConfig;

			setMentionMeConfig(json);
			setLoading(false);
		} catch (error) {
			throw new Error("Caught exception trying to retrieve config for shop");
		}
	}, [country, currency, extension, extensionLanguage, language, marketHandle, marketId, myshopifyDomain, url]);

	/*
	 * Shopify is full of quirks and oddities. There are cases where certain APIs will return values asynchronously, meaning they start undefined and then later resolve to a value.
	 * Their documentation doesn't explain this, and bugs we've raised suggests this isn't the intended behaviour.
	 *
	 * So, we've added a debounce - this gives the API a small amount of time (50 milliseconds at time of writing) to sort itself out. If the values change, we'll cancel the API call.
	 * If the values don't change then we'll call the API.
	 */
	const debouncedFetchMentionMeConfig = useMemo(() => debounce(fetchMentionMeConfig, 50), [fetchMentionMeConfig]);

	useEffect(() => {
		debouncedFetchMentionMeConfig();

		return () => {
			logError("useMentionMeShopifyConfig", "Cancelling debounce", new Error("Cancelling debounce in useMentionMeShopifyConfig"));
			debouncedFetchMentionMeConfig.cancel();
		};
	}, [debouncedFetchMentionMeConfig]);

	return {
		loading,
		mentionMeConfig,
	};
};
