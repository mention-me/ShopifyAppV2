import {
	Banner,
	BlockStack,
	Button,
	Heading,
	Image,
	InlineLayout,
	Link,
	TextBlock,
	useExtensionEditor,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { ReferrerJourneyContext } from "./context/ReferrerJourneyContext";
import useReferrerEntryPoint from "./hooks/useReferrerEntryPoint";

const Extension = () => {
	const {
		loadingMentionMeConfig,
		partnerCode,
		environment,
		errorState,
		referrerEntryPointResponse,
	} = useContext(ReferrerJourneyContext);

	useReferrerEntryPoint();

	// Now we're into the rendering part
	const editor = useExtensionEditor();

	if (loadingMentionMeConfig) {
		return null;
	}

	if (!environment || typeof environment !== "string") {
		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me environment not set. Visit the Mention Me app settings in Shopify to choose an environment." />;
		}

		return null;
	}

	if (!partnerCode || typeof partnerCode !== "string") {
		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me partner code needs to be set to show Mention Me journey. Visit the Mention Me app settings in Shopify to set the partner code." />;
		}

		return null;
	}

	if (errorState) {
		if (editor) {
			return <Banner status="critical"
						   title={"Failed to load Mention Me journey: " + errorState} />;
		}

		return null;
	}

	if (!referrerEntryPointResponse) {
		return null;
	}

	return (
		<BlockStack border="base"
					borderRadius="large"
		>
			<InlineLayout
				padding={["base", "base", "none", "base"]}
			>
				<BlockStack padding="base"
							spacing="base">
					<Heading level={2}>
						{referrerEntryPointResponse.headline}
					</Heading>
					<TextBlock>
						{referrerEntryPointResponse.description}
					</TextBlock>
					<View blockAlignment="center"
						  minBlockSize="fill">
						{/* Button can't support "external". See https://github.com/Shopify/ui-extensions/issues/1835#issuecomment-2113067449
							 And because Link can't be full width, the button is restricted in size :( */}
						<Link external
							  to={referrerEntryPointResponse.url}
						>
							<Button inlineAlignment="center">
								{referrerEntryPointResponse.defaultCallToAction}
							</Button>
						</Link>
					</View>
				</BlockStack>
				{referrerEntryPointResponse.imageUrl && (
					<View
						// 	maxInlineSize={Style.default(200)
						// 	.when({ viewportInlineSize: { min: "small" } }, 200)
						// 	.when({ viewportInlineSize: { min: "medium" } }, 200)
						// 	.when({ viewportInlineSize: { min: "large" } }, 200)}
					>
						<Link external
							  to={referrerEntryPointResponse.url}>
							<Image borderRadius="large"
								   fit="cover"
								   source={referrerEntryPointResponse.imageUrl} />
						</Link>
					</View>
				)}
			</InlineLayout>
			<View background="subdued"
				  borderRadius={["none", "none", "large", "large"]}
				  padding="base"
			>
				<TextBlock appearance="subdued">
					{referrerEntryPointResponse.privacyNotice}
					{" "}
					<Link external
						  to={referrerEntryPointResponse.privacyNoticeUrl}>
						{referrerEntryPointResponse.privacyNoticeLinkText || "More info and your privacy rights"}
					</Link>
				</TextBlock>
			</View>
		</BlockStack>
	);
};

export default Extension;
