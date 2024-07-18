import { reactExtension, useShop } from "@shopify/ui-extensions-react/checkout";

import { RefereeJourneyProvider } from "./context/RefereeJourneyContext";
import CheckoutUI from "./CheckoutUI";
import { setupSentry } from "../../../shared/sentry";
import { useEffect } from "react";

export const SITUATION = "shopify-checkout";

export interface FoundReferrerState {
	referrerMentionMeIdentifier: string;
	referrerToken: string;
}

const Extension = () => {
	const { myshopifyDomain } = useShop();

	useEffect(() => {
		setupSentry(myshopifyDomain, "checkout");
	}, [myshopifyDomain]);

	return <RefereeJourneyProvider>
		<CheckoutUI />
	</RefereeJourneyProvider>;
};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
