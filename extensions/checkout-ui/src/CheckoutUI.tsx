import {
	Banner,
	BlockStack,
	Link,
	SkeletonTextBlock,
	Text,
	useExtensionEditor,
	usePurchasingCompany,
	useSettings,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "./context/RefereeJourneyContext";
import { CheckoutModal } from "./components/CheckoutModal";
import { isValidEnvironment } from "../../../shared/utils";
import { useRefereeSearchContent } from "./hooks/useRefereeSearchContent";
import type { Appearance } from "@shopify/ui-extensions/src/surfaces/checkout/components/shared";
import { TextSize } from "@shopify/ui-extensions/build/ts/surfaces/checkout/components/shared";

const CheckoutUI = () => {
	const translate = useTranslate();

	const editor = useExtensionEditor();

	// As per the B2B Checkout UI guide, we can identify B2B purchases by the presence of a purchasing company.
	// In this case, we want to turn off Mention Me features.
	// https://shopify.dev/docs/apps/build/b2b/create-checkout-ui
	const purchasingCompany = usePurchasingCompany();

	const {
		partnerCode,
		environment,
		loadingRefereeContentApi,
		refereeContentApiResponse,
		step,
		errorState,
	} = useContext(RefereeJourneyContext);

	const { link_appearance: linkAppearance, text_size: textSize }: Partial<{
		link_appearance: Extract<
			Appearance,
			| "accent"
			| "subdued"
			| "info"
			| "success"
			| "warning"
			| "critical"
			| "decorative"
		>,
		text_size: TextSize
	}> = useSettings();

	useRefereeSearchContent();

	const showBeenReferredByFriendLink = useMemo(() => {
		return !errorState && step !== "completed-success";
	}, [errorState, step]);

	if (!purchasingCompany) {
		return null;
	}

	if (loadingRefereeContentApi) {
		return <CheckoutUI.Skeleton />;
	}

	if (!isValidEnvironment(environment)) {
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

	if (!refereeContentApiResponse) {
		console.log("No referee entry point response. Nothing to render.");
		return null;
	}

	if (errorState) {
		return <Banner status="critical"
					   title={errorState} />;
	}

	return (
		<BlockStack spacing="base">
			<View>
				{step === "completed-success" && <Banner status="success"
														 title={translate("success.discount-applied")} />}
				{showBeenReferredByFriendLink && <Text appearance={linkAppearance}
													   size={textSize}>
					{/*
					Link appearance is either the default (undefined) OR it inherits from a parent element when
					using monochrome.
					*/}
					<Link appearance={linkAppearance ? "monochrome" : undefined}
						  overlay={<CheckoutModal />}
					>
						{refereeContentApiResponse.entryCta}
					</Link>
				</Text>}
			</View>
		</BlockStack>
	);
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
CheckoutUI.Skeleton = () => {
	return <SkeletonTextBlock />;
};

export default CheckoutUI;
