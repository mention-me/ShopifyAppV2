import {
	Banner,
	reactExtension,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useSettings,
} from "@shopify/ui-extensions-react/checkout";
import { isValidEnvironment } from "../../../shared/utils";

import { RefereeJourneyContext, RefereeJourneyProvider } from "./context/RefereeJourneyContext";
import CheckoutUI from "./CheckoutUI";

export const SITUATION = "shopify-checkout";

export interface FoundReferrerState {
	referrerMentionMeIdentifier: string;
	referrerToken: string;
}

const Extension = () => {

	// const [json, setJson] = useState<EntryPointLink>();
	// const [nameSearchResult, setNameSearchResult] = useState<NameSearchResult>(undefined);
	// const [shouldProvideEmail, setShouldProvideEmail] = useState(false);
	// const [foundReferrerState, setFoundReferrerState] = useState<FoundReferrerState>(undefined);
	// const [refereeRegisterResult, setRefereeRegisterResult] = useState(undefined);
	//

	const language = useLanguage();
	const country = useLocalizationCountry();

	console.log("language", language);
	console.log("country", country);

	const editor = useExtensionEditor();

	let { mmPartnerCode, layout, environment } = useSettings();
	console.log("environment:", environment);

	if (!isValidEnvironment(environment)) {
		console.error("Mention Me environment not set");

		if (editor) {
			return <Banner
				title="Mention Me environment not set. Choose demo for testing, production for live customers."
				status="critical" />;
		}

		return null;
	}

	if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
		console.error("Mention Me partner code not set");

		if (editor) {
			return <Banner
				title="Mention Me partner code needs to be set to show Mention Me journey. Click the Mention Me app on the left to add it."
				status="critical" />;
		}

		return null;
	}

	return <RefereeJourneyProvider mmPartnerCode={mmPartnerCode} environment={environment}>
		<CheckoutUI />
	</RefereeJourneyProvider>;

};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
