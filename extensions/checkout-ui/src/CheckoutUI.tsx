import {
	Banner,
	BlockStack,
	Link,
	SkeletonTextBlock,
	useExtensionEditor, useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "./context/RefereeJourneyContext";
import { CheckoutModal } from "./components/CheckoutModal";
import { isValidEnvironment } from "../../../shared/utils";
import { useRefereeSearchContent } from "./hooks/useRefereeSearchContent";

const CheckoutUI = () => {
	const translate = useTranslate();

	const editor = useExtensionEditor();

	const {
		partnerCode,
		environment,
		loadingRefereeContentApi,
		refereeContentApiResponse,
		step,
		errorState,
	} = useContext(RefereeJourneyContext);

	useRefereeSearchContent();

	const showBeenReferredByFriendLink = useMemo(() => {
		return !errorState && step !== "completed-success";
	}, [errorState, step]);

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
				{showBeenReferredByFriendLink && <Link overlay={<CheckoutModal />}>
					{refereeContentApiResponse.entryCta}
				</Link>}
			</View>
		</BlockStack>
	);
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
CheckoutUI.Skeleton = () => {
	return <SkeletonTextBlock />;
}

export default CheckoutUI;
