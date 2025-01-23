import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThankYou } from "./ThankYou";
import { reactExtension } from "@shopify/ui-extensions-react/checkout";

const queryClient = new QueryClient();

const ThankYouExtension = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThankYou />
        </QueryClientProvider>
    );
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("purchase.thank-you.block.render", () => <ThankYouExtension />);
