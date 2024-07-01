import { Environment, getDomainForEnvironment } from "../utils";
import {
	useCurrency,
	useExtensionLanguage,
	useLanguage,
	useLocalizationCountry,
	useLocalizationMarket,
	useShop,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export interface MentionMeShopifyConfig {
	shopId?: string,
	environment?: Environment,
	partnerCode?: string,
	defaultLocale?: string,
	refereeModalImage?: string,
}

export const useMentionMeShopifyConfig = () => {
	const { myshopifyDomain } = useShop();

	const [mentionMeConfig, setMentionMeConfig] = useState<MentionMeShopifyConfig>({
		shopId: undefined,
		partnerCode: "",
		environment: null,
		defaultLocale: "",
	});

	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();

	const [loading, setLoading] = useState(true);

	const url = getDomainForEnvironment("production");

	useEffect(() => {
		const fetchMentionMeConfig = async () => {
			const u = new URL(`https://${url}/shopify/app/config/${myshopifyDomain}`);
			u.searchParams.append("extensionLanguage", extensionLanguage.isoCode);
			u.searchParams.append("language", language.isoCode);
			u.searchParams.append("currency", currency.isoCode);
			u.searchParams.append("country", country.isoCode);
			u.searchParams.append("market", market.id);
			u.searchParams.append("marketHandle", market.handle);

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
	}, [country.isoCode, currency.isoCode, extensionLanguage.isoCode, language.isoCode, market.handle, market.id, myshopifyDomain, url]);


	return {
		loading,
		mentionMeConfig,
	};
};
