import { reactExtension, useOrder, useShop } from "@shopify/ui-extensions-react/checkout";
import Extension from "./Extension";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { useEffect } from "react";
import { setupSentry } from "../../../shared/sentry";

const OrderStatus = () => {
	const order = useOrder();

	const { myshopifyDomain } = useShop();

	useEffect(() => {
		setupSentry(myshopifyDomain, "order-status");
	}, [myshopifyDomain]);

	return <ReferrerJourneyProvider orderId={order.id}>
		<Extension />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
