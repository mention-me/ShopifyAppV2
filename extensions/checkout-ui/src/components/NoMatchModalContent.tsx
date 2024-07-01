import {
	BlockStack,
	Button,
	Heading,
	TextBlock,
	useApi,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { CHECKOUT_MODAL_ID } from "./CheckoutModal";

const NoMatchModalContent = () => {
	const {ui} = useApi();

	const translate = useTranslate();

	const {
		setStep,
	} = useContext(RefereeJourneyContext);

	const tryAgain = useCallback(() => {
		setStep("search-by-name");
	}, [setStep]);

	return (
		<>
			<Heading level={1}>
				{translate("no-match.headline")}
			</Heading>
			<TextBlock>
				{translate("no-match.description")}
			</TextBlock>

			<BlockStack>
				<View>
					<Button onPress={tryAgain}
					>
						{translate("no-match.try-again")}
					</Button>
				</View>
				<View>
					<Button onPress={() => {
						// Poorly documented function, see:
						// https://github.com/Shopify/ui-extensions/issues/1009
						ui.overlay.close(CHECKOUT_MODAL_ID)
					}}>
						{translate("no-match.continue-shopping")}
					</Button>
				</View>
			</BlockStack>
		</>
	);
};

export default NoMatchModalContent;
