import {
	Banner,
	BlockLayout,
	Button,
	Image,
	Link,
	reactExtension,
	useBillingAddress,
	useEmail,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useOrder,
	useSettings,
	useTotalAmount,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/mention-me/src/types";
import { useEffect, useMemo, useState } from "react";

import { isValidEnvironment, parseShopifyId } from "../../../shared/utils";
import { fetchReferrerEntryPoint } from "../../../shared/referrerEntryPoint";
import { APP_NAME, APP_VERSION } from "../../../shared/constants";
import { setupSentry } from "../../../shared/sentry";

setupSentry();

const Extension = () => {
	const email = useEmail();
	const money = useTotalAmount();
	const billingAddress = useBillingAddress();
	const order = useOrder();
	const language = useLanguage();
	const country = useLocalizationCountry();

	console.log("language", language);
	console.log("country", country);

	const editor = useExtensionEditor();

	const [json, setJson] = useState<EntryPointOfferAndLink | null>(null);

	let { mmPartnerCode, layout, environment } = useSettings();

	const body: EntryPointForReferrerType = useMemo(() => {
		return {
			customer: {
				emailAddress: email,
				firstname: billingAddress?.firstName,
				surname: billingAddress?.lastName,
			},
			request: {
				partnerCode: mmPartnerCode,
				situation: "shopify-order-status",
				appVersion: APP_VERSION,
				appName: APP_NAME,
				// TODO(EHG): Figure out locales
				localeCode: "en_GB",
			},
			implementation: {
				wrapContentWithBranding: true,
				showCloseIcon: false,
			},
			order: {
				orderIdentifier: parseShopifyId(order?.id),
				currencyCode: money.currencyCode,
				total: String(money.amount),
				// Use the time of the request instead of explicitly setting a time.
				dateString: "",
			},
		};
	}, [email, billingAddress, mmPartnerCode, order, money]);

	useEffect(() => {
		if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		fetchReferrerEntryPoint({
			environment,
			body,
			setJson,
		});
	}, [body, setJson]);

	console.log("Json", json);

	// Now we're into the rendering part

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

	if (layout === "banner") {
		return <Banner title={json.description} status="info">
			<Link external to={json.url}>
				{json.defaultCallToAction}
			</Link>
		</Banner>;
	}

	return (
		<BlockLayout rows={[60, "fill"]}>
			<View blockAlignment="center">
				<Button to={json.url}>
					{json.defaultCallToAction}
				</Button>
			</View>
			<View>
				{json.imageUrl && (
					<Link external={true} to={json.url}>
						<Image source={json.imageUrl} />
					</Link>
				)}
			</View>
		</BlockLayout>
	);
};


export default reactExtension(
	"customer-account.order-status.block.render",
	() => <Extension />,
);
