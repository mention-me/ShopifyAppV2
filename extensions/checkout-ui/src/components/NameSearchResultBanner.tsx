import { Banner } from "@shopify/ui-extensions-react/checkout";
import { NameSearchResult } from "../Checkout";

interface NameSearchResultBannerProps {
	nameSearchResult: NameSearchResult;
	shouldProvideEmail: boolean;
}

export const NameSearchResultBanner = ({ nameSearchResult, shouldProvideEmail }: NameSearchResultBannerProps) => {
	if (nameSearchResult === "single-match") {
		return <Banner title="Welcome!" status="success" />;
	}

	if (nameSearchResult === "no-match") {
		return <Banner title="Sorry, no match" status="critical" />;
	}

	if (nameSearchResult === "error") {
		return <Banner title="Error" status="critical" />;
	}

	if (shouldProvideEmail) {
		return <Banner
			title="Sorry, we can't find your friend. Try searching with their email address too."
			status="warning" />;
	}

	// No banner required
	return null;
};
