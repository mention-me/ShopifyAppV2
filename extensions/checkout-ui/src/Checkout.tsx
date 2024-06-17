import {
	Banner,
	BlockLayout,
	BlockStack,
	Button,
	Form,
	Grid,
	Link,
	Modal,
	reactExtension,
	TextField,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useSettings,
	View,
} from "@shopify/ui-extensions-react/checkout";

import { useEffect, useMemo, useState } from "react";
import { isValidEnvironment } from "../../../shared/utils";
import { fetchRefereeEntryPoint } from "../../../shared/refereeEntryPoint";
import { EntryPointForRefereeType, EntryPointLink } from "@api/mention-me/dist/types";

const Extension = () => {
	const [json, setJson] = useState<EntryPointLink>();
	const [shouldProvideEmail, setShouldProvideEmail] = useState(false);

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
				situation: "shopify-checkout",
				appVersion: "v0.1",
				appName: "mention-me-shopify-app",
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


	if (!environment || typeof environment !== "string") {
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

	if (!json) {
		return null;
	}

	return (
		json && (
			<BlockStack spacing="base">
				<View>
					<Link overlay={<Modal title="Welcome! Let us know who sent you." padding>
						<BlockLayout>
							<Form
								onSubmit={() => {
									console.log("Submitted");
									setShouldProvideEmail(true);
								}}
								disabled={false}
							>
								<Grid spacing="base">
									{shouldProvideEmail && <Banner
										title="Sorry, we can't find your friend. Try searching with their email address too."
										status="warning" />}
									<TextField label="Your friends name" icon={{ source: "magnify", position: "end" }}
											   autocomplete={false} />
									{shouldProvideEmail && (
										<TextField label="Your friends email" type="email"
												   icon={{ source: "magnify", position: "end" }} autocomplete={false} />
									)}
									<Button accessibilityRole="submit">Submit</Button>
								</Grid>
							</Form>
						</BlockLayout>
					</Modal>}>
						{json.defaultCallToAction}
					</Link>
				</View>
			</BlockStack>
		)
	);
};

export default reactExtension("purchase.checkout.block.render", () => <Extension />);
