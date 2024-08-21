import {
	reactExtension,
	useCurrency,
	useExtensionLanguage,
	useLanguage,
	useLocalizationCountry,
	useLocalizationMarket,
	useOrder,
	usePurchasingCompany,
	useShop,
} from "@shopify/ui-extensions-react/checkout";
import Extension from "./Extension";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";
import { consoleError } from "../../../shared/logging";


const OrderStatus = () => {
	const { myshopifyDomain } = useShop();

	// Setup sentry as soon as possible so that we can catch failures.
	setupSentry(myshopifyDomain, "order-status");

	const order = useOrder();
	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();

	// As per the B2B Checkout UI guide, we can identify B2B purchases by the presence of a purchasing company.
	// In this case, we want to turn off Mention Me features.
	// https://shopify.dev/docs/apps/build/b2b/create-checkout-ui
	const purchasingCompany = usePurchasingCompany();

	const { loading, mentionMeConfig } = useMentionMeShopifyConfig({
			myshopifyDomain,
			extension: "order-status",
			extensionLanguage: extensionLanguage.isoCode,
			language: language.isoCode,
			country: country?.isoCode,
			currency: currency.isoCode,
			marketId: market?.id,
			marketHandle: market?.handle,
		},
	);

	if (purchasingCompany) {
		consoleError("OrderStatus", "Purchasing company found. We're in a B2B situation. Mention Me features will be disabled.", purchasingCompany);

		return null;
	}

	if (loading) {
		return <Extension.Skeleton />;
	}

	if (!mentionMeConfig) {
		return null;
	}

	return <ReferrerJourneyProvider mentionMeConfig={mentionMeConfig}
									orderId={order.id}>
		<Extension extensionType="order-status" />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
