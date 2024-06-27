import { Environment, getDomainForEnvironment } from "../utils";
import { useShop } from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export interface MentionMeShopifyConfig {
	shopId?: string,
	environment?: Environment,
	partnerCode?: string,
	defaultLocale?: string,
}

export const useMentionMeShopifyConfig = () => {
	const { myshopifyDomain } = useShop();

	const [mentionMeConfig, setMentionMeConfig] = useState<MentionMeShopifyConfig>({
		shopId: undefined,
		partnerCode: "",
		environment: null,
		defaultLocale: "",
	});

	const [loading, setLoading] = useState(true);

	const url = getDomainForEnvironment("local");

	useEffect(() => {
		const fetchMentionMeConfig = async () => {
			try {
				const response = await fetch(`https://${url}/shopify/app/config/${myshopifyDomain}`,
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
	}, [myshopifyDomain, url]);


	return {
		loading,
		mentionMeConfig
	};
};
