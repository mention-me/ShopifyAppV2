import {
	reactExtension,
	useCurrency,
	useExtensionLanguage,
	useLanguage,
	useLocalizationCountry,
	useLocalizationMarket,
	useShop,
} from "@shopify/ui-extensions-react/checkout";

import { RefereeJourneyProvider } from "./context/RefereeJourneyContext";
import CheckoutUI from "./CheckoutUI";
import { setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";

export const SITUATION = "shopify-checkout";

export interface FoundReferrerState {
	referrerMentionMeIdentifier: string;
	referrerToken: string;
}

const Extension = () => {
	const { myshopifyDomain } = useShop();

	setupSentry(myshopifyDomain, "checkout");

	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();

	const { loading, mentionMeConfig } = useMentionMeShopifyConfig({
			myshopifyDomain,
			extension: "checkout",
			extensionLanguage: extensionLanguage.isoCode,
			language: language.isoCode,
			country: country?.isoCode,
			currency: currency.isoCode,
			marketId: market?.id,
			marketHandle: market?.handle,
		},
	);

	if (loading) {
		return <CheckoutUI.Skeleton />;
	}

	if (!mentionMeConfig) {
		return null;
	}

	return <RefereeJourneyProvider mentionMeConfig={mentionMeConfig}>
		<CheckoutUI />
	</RefereeJourneyProvider>;
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("purchase.checkout.reductions.render-after", () => <Extension />);
