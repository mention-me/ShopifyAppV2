import { reactExtension } from "@shopify/ui-extensions-react/checkout";

import { RefereeJourneyProvider } from "./context/RefereeJourneyContext";
import CheckoutUI from "./CheckoutUI";
import { setupSentry } from "../../../shared/sentry";

export const SITUATION = "shopify-checkout";

export interface FoundReferrerState {
	referrerMentionMeIdentifier: string;
	referrerToken: string;
}

setupSentry();

const Extension = () => {
	return <RefereeJourneyProvider>
		<CheckoutUI />
	</RefereeJourneyProvider>;

};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
