import {
	Banner,
	BlockStack,
	Link,
	SkeletonTextBlock,
	useExtensionEditor,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "./context/RefereeJourneyContext";
import { CheckoutModal } from "./components/CheckoutModal";
import { isValidEnvironment } from "../../../shared/utils";
import { useRefereeEntryPoint } from "./hooks/useRefereeEntryPoint";

const CheckoutUI = () => {
	const editor = useExtensionEditor();

	const {
		partnerCode,
		environment,
		loadingMentionMeConfig,
		loadingEntryPointApi,
		refereeEntryPointResponse,
		step,
		errorState,
	} = useContext(RefereeJourneyContext);

	useRefereeEntryPoint();

	const showBeenReferredByFriendLink = useMemo(() => {
		return !errorState && step !== "completed-success";
	}, [errorState, step]);

	if (loadingMentionMeConfig || loadingEntryPointApi) {
		return <SkeletonTextBlock />;
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

	if (!refereeEntryPointResponse) {
		console.log("No referee entry point response. Nothing to render.");
		return null;
	}

	if (errorState) {
		if (editor) {
			return <Banner status="critical"
						   title={"Failed to load Mention Me journey: " + errorState} />;
		}

		return null;
	}

	return (
		<BlockStack spacing="base">
			<View>
				{step === "completed-success" && <Banner status="success"
														 title="Your discount has been applied for being referred. Thank you!" />}
				{showBeenReferredByFriendLink && <Link overlay={<CheckoutModal />}>
					{refereeEntryPointResponse.defaultCallToAction}
				</Link>}
			</View>
		</BlockStack>
	);
};

export default CheckoutUI;