import { reactExtension, useOrder } from "@shopify/ui-extensions-react/checkout";
import Extension from "./Extension";

const OrderStatus = () => {
	const { order } = useOrder();

	return <Extension orderId={order.id} />;
};

export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
