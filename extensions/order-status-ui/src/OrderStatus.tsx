import {
	reactExtension,
	useCurrency,
	useEmail,
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
import { logError, setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";
import { consoleError } from "../../../shared/logging";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "@sentry/react";


const OrderStatus = () => {
	const { myshopifyDomain } = useShop();

	// Debug code for https://github.com/Shopify/ui-extensions/issues/2280#issuecomment-2311068495
	const shop = useShop();

	// Setup sentry as soon as possible so that we can catch failures.
	setupSentry(myshopifyDomain, "order-status");

	const order = useOrder();
	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();
	const email = useEmail();

	if (!email) {
		logError("OrderStatus", "No email exists", new Error("useEmail hook did not receive an email address"));
	}

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

	const [orderError, setOrderError] = useState(false);

	// Debug code for https://github.com/Shopify/ui-extensions/issues/2280#issuecomment-2311068495
	useEffect(() => {
		if (!order || !order?.id) {
			const msg = `No order data. The Shop data is: ${shop}`;
			logError("OrderStatus", msg, new Error(msg));

			return;
		}
	}, [order, shop]);

	useEffect(() => {
		if (!orderError) {
			return;
		}

		if (order && order.id) {
			const msg = "Order found from Shopify API after previously failing. Order ID: " + order.id;
			logError("OrderStatus", msg, new Error(msg));

			return;
		}

		if (order && !order.id) {
			const msg = "Order found, but with no order id, from Shopify API after previously failing.";
			logError("OrderStatus", msg, new Error(msg));

			return;
		}
	}, [order, orderError]);

	if (!order) {
		setOrderError(true);

		const msg = `No order object from Shopify API.`;
		logError("OrderStatus", msg, new Error(msg));

		return null;
	}

	if (!order.id) {
		setOrderError(true);

		const msg = `Order object found, but no ID from Shopify API. Order ID: [${order?.id}], Order object: ${JSON.stringify(order)}`;
		logError("OrderStatus", msg, new Error(msg));

		return null;
	}


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
		<ErrorBoundary beforeCapture={(scope, error) => {
			consoleError("OrderStatus", "Error boundary caught error", error);

			scope.setTag("component", "OrderStatus");
		}}>
			<Extension extensionType="order-status" />
		</ErrorBoundary>
	</ReferrerJourneyProvider>;
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
