import {
	Banner,
	BlockStack,
	Link,
	SkeletonTextBlock,
	useExtensionEditor,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "./context/RefereeJourneyContext";
import { useRefereeEntryPoint } from "./hooks/useRefereeEntryPoint";
import { CheckoutModal } from "./components/CheckoutModal";

const CheckoutUI = () => {
	const editor = useExtensionEditor();
	const { loadingEntryPointApi, refereeEntryPointResponse } = useContext(RefereeJourneyContext);

	// On load, fetch the referee entry point to get the "Been referred by a friend?" link.
	useRefereeEntryPoint();

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
			return <Banner title={"Failed to load Mention Me journey: " + error} status="critical" />;
		}

		return null;
	}

	return (
		<BlockStack spacing="base">
			<View>
				{/*{refereeRegisterResult ? <Banner title="Thank you for registering!" status="success" /> :*/}
				<Link overlay={<CheckoutModal />}>
					{refereeEntryPointJson.defaultCallToAction}
				</Link>
			</View>
		</BlockStack>
	);
};

export default CheckoutUI;
