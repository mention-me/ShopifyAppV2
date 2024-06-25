import { reactExtension, useOrder } from "@shopify/ui-extensions-react/checkout";
import Extension from "./Extension";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";

const OrderStatus = () => {
	const order = useOrder();

	return <ReferrerJourneyProvider orderId={order.id}>
		<Extension />
	</ReferrerJourneyProvider>;
};

export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
