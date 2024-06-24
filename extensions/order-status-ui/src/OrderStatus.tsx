import { reactExtension } from "@shopify/ui-extensions-react/checkout";
import Extension from "./Extension";

const OrderStatus = () => {
	return <Extension />;
};

export default reactExtension(
	"customer-account.order-status.block.render",
	() => <OrderStatus />,
);
