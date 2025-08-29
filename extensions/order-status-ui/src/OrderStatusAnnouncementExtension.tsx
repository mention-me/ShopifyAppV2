import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrderStatus } from "./OrderStatus";
import { reactExtension } from "@shopify/ui-extensions-react/customer-account";

const queryClient = new QueryClient();

const OrderStatusAnnouncementExtension = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <OrderStatus announcement />
        </QueryClientProvider>
    );
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("customer-account.order-status.announcement.render", () => <OrderStatusAnnouncementExtension />);
