import { Environment, getDomainForEnvironment } from "../utils";
import { useEffect, useState } from "react";

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
	marketHandle?: string
}

export const useMentionMeShopifyConfig = ({myshopifyDomain, extension, extensionLanguage, language, currency, country, marketId, marketHandle}: Props) => {

	const [mentionMeConfig, setMentionMeConfig] = useState<MentionMeShopifyConfig>({
		shopId: undefined,
		partnerCode: "",
		environment: null,
		defaultLocale: "",
	});

	const [loading, setLoading] = useState(true);

	const url = getDomainForEnvironment("production");

	useEffect(() => {
		const fetchMentionMeConfig = async () => {
			const u = new URL(`https://${url}/shopify/app/config/${myshopifyDomain}`);
			u.searchParams.append("extensionLanguage", extensionLanguage);
			u.searchParams.append("language", language);
			u.searchParams.append("currency", currency);
			u.searchParams.append("country", country);
			u.searchParams.append("market", marketId);
			u.searchParams.append("marketHandle", marketHandle);
			u.searchParams.append("extension", extension);

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
		};

		fetchMentionMeConfig();
	}, [country, currency, extensionLanguage, language, marketHandle, marketId, myshopifyDomain, url]);


	return {
		loading,
		mentionMeConfig,
	};
};
