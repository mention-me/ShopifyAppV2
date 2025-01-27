import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reactExtension } from "@shopify/ui-extensions-react/checkout";
import Checkout from "./Checkout";

const queryClient = new QueryClient();

const Extension = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Checkout />
        </QueryClientProvider>
    );
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("purchase.checkout.reductions.render-after", () => <Extension />);
