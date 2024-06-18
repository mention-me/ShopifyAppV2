import {
	Banner,
	BlockStack,
	Link,
	reactExtension,
	SkeletonTextBlock, useApplyDiscountCodeChange,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useSettings,
	View,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useMemo, useState } from "react";
import { isValidEnvironment } from "../../../shared/utils";
import { fetchRefereeEntryPoint } from "./refereeEntryPoint";
import { EntryPointForRefereeType, EntryPointLink } from "@api/mention-me/dist/types";
import { APP_NAME, APP_VERSION } from "../../../shared/constants";
import { FindFriendModal } from "./FindFriendModal";
import { WhoAreYouModal } from "./WhoAreYouModal";

export const SITUATION = "shopify-checkout";

export type NameSearchResult = "loading" | "no-match" | "duplicate-match" | "single-match" | "error";

export interface FoundReferrerState {
	referrerMentionMeIdentifier: string;
	referrerToken: string;
}

const Extension = () => {
	const [json, setJson] = useState<EntryPointLink>();
	const [nameSearchResult, setNameSearchResult] = useState<NameSearchResult>(undefined);
	const [shouldProvideEmail, setShouldProvideEmail] = useState(false);
	const [foundReferrerState, setFoundReferrerState] = useState<FoundReferrerState>(undefined);
	const [refereeRegisterResult, setRefereeRegisterResult] = useState(undefined);

	const applyDiscountChange = useApplyDiscountCodeChange();

	const language = useLanguage();
	const country = useLocalizationCountry();

	console.log("language", language);
	console.log("country", country);

	const editor = useExtensionEditor();

	let { mmPartnerCode, layout, environment } = useSettings();
	console.log("environment", environment);

	const body: EntryPointForRefereeType = useMemo(() => {
		return {
			request: {
				partnerCode: mmPartnerCode,
				situation: SITUATION,
				appVersion: APP_VERSION,
				appName: APP_NAME,
				// TODO(EHG): Figure out locales
				localeCode: "en_GB",
			},
			implementation: {
				wrapContentWithBranding: true,
				showCloseIcon: false,
			},
		};
	}, [mmPartnerCode]);

	useEffect(() => {
		if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		fetchRefereeEntryPoint({
			environment,
			body,
			setJson,
		});
	}, [fetchRefereeEntryPoint, mmPartnerCode, language, setJson]);

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

	return (
		json ? (
			<BlockStack spacing="base">
				<View>
					{refereeRegisterResult ? <Banner title="Thank you for registering!" status="success" /> :
						<Link overlay={nameSearchResult === "single-match" ?
							<WhoAreYouModal
								mmPartnerCode={mmPartnerCode}
								environment={environment}
								foundReferrerState={foundReferrerState}
								setRefereeRegisterResult={setRefereeRegisterResult}
							/> :
							<FindFriendModal
								environment={environment}
								mmPartnerCode={mmPartnerCode}
								shouldProvideEmail={shouldProvideEmail}
								setShouldProvideEmail={setShouldProvideEmail}
								nameSearchResult={nameSearchResult}
								setNameSearchResult={setNameSearchResult}
								setFoundReferrerState={setFoundReferrerState}
							/>}>
							{json.defaultCallToAction}
						</Link>}
				</View>
			</BlockStack>
		) : <SkeletonTextBlock />
	);
};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
