import Extension from "./Extension";
import { reactExtension, useApi, useSubscription } from "@shopify/ui-extensions-react/checkout";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";

const ThankYou = () => {
	const { orderConfirmation } = useApi("purchase.thank-you.block.render");
	const { order } = useSubscription(orderConfirmation);

	return <ReferrerJourneyProvider orderId={order.id}>
		<Extension />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"purchase.thank-you.block.render",
	() => <ThankYou />,
);
