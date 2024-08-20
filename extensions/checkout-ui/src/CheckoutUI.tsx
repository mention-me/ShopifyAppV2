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
import { logError } from "../../../shared/sentry";
import { consoleError } from "../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";

const CheckoutUI = () => {
	const translate = useTranslate();

	const editor = useExtensionEditor();

	// As per the B2B Checkout UI guide, we can identify B2B purchases by the presence of a purchasing company.
	// In this case, we want to turn off Mention Me features.
	// https://shopify.dev/docs/apps/build/b2b/create-checkout-ui
	const purchasingCompany = usePurchasingCompany();

	const {
		mentionMeConfig,
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

	if (purchasingCompany) {
		consoleError("CheckoutUI", "Purchasing company found. We're in a B2B situation. Mention Me features will be disabled.", purchasingCompany);

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

		consoleError("CheckoutUI", "Invalid environment set", environment);
		return null;
	}

	if (!partnerCode || typeof partnerCode !== "string") {
		if (editor) {
			return <Banner
				status="critical"
				title="Mention Me partner code needs to be set to show Mention Me journey. Visit the Mention Me app settings in Shopify to set the partner code." />;
		}

		consoleError("CheckoutUI", "Invalid Mention Me Partner Code set", partnerCode);
		return null;
	}

	if (!refereeContentApiResponse) {
		consoleError("CheckoutUI", "No referee entry point response. Nothing to render.");

		return null;
	}

	if (errorState) {
		logError("CheckoutUI", "Error state", new Error(errorState));

		return <Banner status="critical"
					   title={errorState} />;
	}

	return (
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "CheckoutUI");
			scope.setTag("locale", mentionMeConfig.defaultLocale);
		}}>
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
		</ErrorBoundary>
	);
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
CheckoutUI.Skeleton = () => {
	return <SkeletonTextBlock />;
};

export default CheckoutUI;
