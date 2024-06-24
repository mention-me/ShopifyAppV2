import {
	Banner,
	reactExtension,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useSettings,
} from "@shopify/ui-extensions-react/checkout";
import { isValidEnvironment } from "../../../shared/utils";

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
	const editor = useExtensionEditor();

	let { mmPartnerCode, environment } = useSettings();

	// TODO(EHG): Remove. Useful for testing.
	if (!mmPartnerCode) {
		mmPartnerCode = "mmf1c1195b";
	}

	if (!environment || typeof environment !== "string") {
		environment = "demo";
	}

	if (!isValidEnvironment(environment)) {
		console.error("Mention Me environment not set");

		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me environment not set. Choose demo for testing, production for live customers." />;
		}

		return null;
	}

	if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
		console.error("Mention Me partner code not set");

		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me partner code needs to be set to show Mention Me journey. Click the Mention Me app on the left to add it." />;
		}

		return null;
	}

	return <RefereeJourneyProvider
		environment={environment}
		mmPartnerCode={mmPartnerCode}>
		<CheckoutUI />
	</RefereeJourneyProvider>;

};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
