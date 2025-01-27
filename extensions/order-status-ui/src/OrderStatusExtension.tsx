import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderStatus } from "./OrderStatus";
import { reactExtension } from "@shopify/ui-extensions-react/customer-account";

const queryClient = new QueryClient();

const OrderStatusExtension = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <OrderStatus />
        </QueryClientProvider>
    );
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("customer-account.order-status.block.render", () => <OrderStatusExtension />);
