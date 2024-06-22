import { Banner } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";


export const NameSearchResultBanner = () => {
	const {
		search,
		nameSearchResult,
	} = useContext(RefereeJourneyContext);

	if (!nameSearchResult) {
		return null;
	}

	if (nameSearchResult.type === "no-match" && search.email) {
		return <Banner status="critical"
					   title="Sorry, we can't find your friend. We'd recommend you confirm the email address they used with us and try again later." />;
	}

	if (nameSearchResult.type === "duplicate-match" || (nameSearchResult.type === "no-match" && !search.email)) {
		return <Banner status="warning"
					   title={`Sorry, we can't find your friend by the name '${search.name}'. Try searching with their email address too.`} />;
	}

	if (nameSearchResult.type === "error") {
		return <Banner status="critical"
					   title="Sorry, an error has occurred. Please try again later." />;
	}

	// No banner required
	return null;
};
