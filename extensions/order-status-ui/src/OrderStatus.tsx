import {
	Banner,
	BlockSpacer,
	BlockStack,
	Button,
	Grid,
	GridItem,
	Heading,
	Image,
	Link,
	reactExtension,
	TextBlock,
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
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import { useEffect, useMemo, useState } from "react";

import { isValidEnvironment, parseShopifyId } from "../../../shared/utils";
import { fetchReferrerEntryPoint } from "../../../shared/referrerEntryPoint";
import { APP_NAME, APP_VERSION } from "../../../shared/constants";

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

	const [json, setJson] = useState<EntryPointOfferAndLink>(null);

	let { mmPartnerCode, layout, environment } = useSettings();

	mmPartnerCode = "mmf1c1195b";
	environment = "demo";

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
	}, [body, environment, mmPartnerCode, setJson]);

	console.log("Json", json);

	// Now we're into the rendering part

	if (!environment || typeof environment !== "string") {
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

	if (!json) {
		return null;
	}

	if (layout === "banner") {
		return <Banner status="info"
					   title={json.description}>
			<Link external
				  to={json.url}>
				{json.defaultCallToAction}
			</Link>
		</Banner>;
	}

	return (
		<BlockStack border="base"
					borderRadius="large"
		>
			<Grid columns={["1fr", "1fr"]}
				  padding={["base", "base", "none", "base"]}
			>
				<GridItem>
					<BlockStack padding="base"
								spacing="base">
						{/*<BlockSpacer />*/}
						<Heading level={2}>
							{json.headline}
						</Heading>
						<TextBlock>
							{json.description}
						</TextBlock>
						<BlockSpacer />
						<View blockAlignment="center"
							  minBlockSize="fill">
							{/* Button can't support "external". See https://github.com/Shopify/ui-extensions/issues/1835#issuecomment-2113067449
							 And because Link can't be full width, the button is restricted in size :( */}
							<Link external
								  to={json.url}
							>
								<Button inlineAlignment="center">
									{json.defaultCallToAction}
								</Button>
							</Link>
						</View>
					</BlockStack>
				</GridItem>
				{json.imageUrl && (
					<GridItem>
						{/*<BlockStack>*/}
						{/*<BlockSpacer />*/}
						<View>
							<Link external
								  to={json.url}>
								<Image borderRadius="large"
									   fit="cover"
									   source={json.imageUrl} />
							</Link>
						</View>
						{/*<BlockSpacer />*/}
						{/*</BlockStack>*/}
					</GridItem>
				)}
			</Grid>
			<View background="subdued"
				  padding="base">
				<TextBlock appearance="subdued">
					{json.privacyNotice}
					{" "}
					<Link external
						  to={json.privacyNoticeUrl}>
						{json.privacyNoticeLinkText || "More info and your privacy rights"}
					</Link>
				</TextBlock>
			</View>
		</BlockStack>
	);
};


export default reactExtension(
	"customer-account.order-status.block.render",
	() => <Extension />,
);
