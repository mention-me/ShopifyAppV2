import { Banner, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { isValidEmail } from "../../../../shared/utils";


export const NameSearchResultBanner = () => {
	const {
		search,
		nameSearchResult,
	} = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	if (!nameSearchResult) {
		return null;
	}

	if (nameSearchResult.type === "no-match" && search.email && isValidEmail(search.email)) {
		return <Banner status="critical"
					   title={translate("banner.no-match")} />;
	}

	if (nameSearchResult.type === "duplicate-match" || (nameSearchResult.type === "no-match" && !isValidEmail(search.email))) {
		return <Banner status="warning"
					   title={translate("banner.search-by-email", {
						   name: search.name,
					   })} />;
	}

	if (nameSearchResult.type === "error") {
		return <Banner status="critical"
					   title={translate("banner.error")} />;
	}

	// No banner required
	return null;
};
