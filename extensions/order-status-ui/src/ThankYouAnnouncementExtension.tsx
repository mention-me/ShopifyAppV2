import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThankYou } from "./ThankYou";
import { reactExtension } from "@shopify/ui-extensions-react/checkout";

const queryClient = new QueryClient();

const ThankYouAnnouncementExtension = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThankYou announcement />
        </QueryClientProvider>
    );
};

// Changing this? Don't forget to change the .toml file too.
export default reactExtension("purchase.thank-you.announcement.render", () => <ThankYouAnnouncementExtension />);
