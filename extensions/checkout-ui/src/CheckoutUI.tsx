import {
	Banner,
	BlockStack,
	Link,
	SkeletonTextBlock, useCurrency,
	useExtensionEditor, useExtensionLanguage, useLanguage, useLocalizationCountry, useLocalizationMarket,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useEffect, useMemo } from "react";
import { RefereeJourneyContext } from "./context/RefereeJourneyContext";
import { useRefereeEntryPoint } from "./hooks/useRefereeEntryPoint";
import { CheckoutModal } from "./components/CheckoutModal";

const CheckoutUI = () => {
	const editor = useExtensionEditor();
	const {
		loadingEntryPointApi,
		refereeEntryPointResponse,
		step,
		errorState,
	} = useContext(RefereeJourneyContext);

	// On load, fetch the referee entry point to get the "Been referred by a friend?" link.
	useRefereeEntryPoint();

	const showBeenReferredByFriendLink = useMemo(() => {
		return !errorState && step !== "completed-success";
	}, [errorState, step]);

	if (loadingEntryPointApi) {
		return <SkeletonTextBlock />;
	}

	if (!refereeEntryPointResponse) {
		console.log("No referee entry point response. Nothing to render.");
		return null;
	}

	const { error, refereeEntryPointJson } = refereeEntryPointResponse;

	if (error) {
		if (editor) {
			return <Banner status="critical"
						   title={"Failed to load Mention Me journey: " + error} />;
		}

		return null;
	}

	return (
		<BlockStack spacing="base">
			<View>
				{step === "completed-success" && <Banner status="success"
														 title="Your discount has been applied for being referred. Thank you!" />}
				{errorState && <Banner status="critical"
									   title={errorState} />}
				{showBeenReferredByFriendLink && <Link overlay={<CheckoutModal />}>
					{refereeEntryPointJson.defaultCallToAction}
				</Link>}
			</View>
		</BlockStack>
	);
};

export default CheckoutUI;
