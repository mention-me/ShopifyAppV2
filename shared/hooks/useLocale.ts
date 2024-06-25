import { useMentionMeShopifyConfig } from "./useMentionMeShopifyConfig";
import { useLanguage } from "@shopify/ui-extensions-react/checkout";

const useLocale = () => {
	const { defaultLocale } = useMentionMeShopifyConfig();

	let { isoCode: language } = useLanguage();

	language = language.replace("-", "_");

	if (language.length === 5 && /^[a-z]{2}_[a-z]{2}$/i.test(language)) {
		return language;
	}

	if (typeof defaultLocale === "string" && defaultLocale.length === 5 && /^[a-z]{2}_[a-z]{2}$/i.test(defaultLocale)) {
		return defaultLocale;
	}

	throw new Error(`Invalid language from Shopify [${language}] and no valid default locale [${defaultLocale}].`);
}

export default useLocale;
