import Extension from "./Extension";
import { reactExtension, useApi, useShop, useSubscription } from "@shopify/ui-extensions-react/checkout";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { useEffect } from "react";
import { setupSentry } from "../../../shared/sentry";

const ThankYou = () => {
	const { orderConfirmation } = useApi("purchase.thank-you.block.render");
	const { order } = useSubscription(orderConfirmation);

	const { myshopifyDomain } = useShop();

	useEffect(() => {
		setupSentry(myshopifyDomain, "thank-you");
	}, [myshopifyDomain]);

	return <ReferrerJourneyProvider orderId={order.id}>
		<Extension />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"purchase.thank-you.block.render",
	() => <ThankYou />,
);
