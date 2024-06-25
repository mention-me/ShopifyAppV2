import Extension from "./Extension";
import { reactExtension, useApi, useSubscription } from "@shopify/ui-extensions-react/checkout";

const ThankYou = () => {
	const { orderConfirmation } = useApi("purchase.thank-you.block.render");
	const { order } = useSubscription(orderConfirmation);

	return <Extension orderId={order.id} />;
};

export default reactExtension(
	"purchase.thank-you.block.render",
	() => <ThankYou />,
);
