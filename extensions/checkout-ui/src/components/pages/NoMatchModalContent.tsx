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
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import { CHECKOUT_MODAL_ID } from "../CheckoutModal";

const NoMatchModalContent = () => {
	const { ui } = useApi();

	const translate = useTranslate();

	const {
		setStep,
		nameSearchResult,
		setNameSearchResult,
	} = useContext(RefereeJourneyContext);

	const tryAgain = useCallback(() => {
		setNameSearchResult((value) => {
			// Pretend we only hit a no-match to reset the state back.
			return {
				...value,
				type: "no-match",
			};
		});
		setStep("no-match");
	}, [setNameSearchResult, setStep]);

	return (
		<>
			<Heading level={1}>
				{nameSearchResult.content.headline}
			</Heading>
			<TextBlock>
				{nameSearchResult.content.description}
			</TextBlock>

			<BlockStack>
				<View>
					<Button onPress={tryAgain}
					>
						{nameSearchResult.content.back}
					</Button>
				</View>
				<View>
					<Button onPress={() => {
						// Poorly documented function, see:
						// https://github.com/Shopify/ui-extensions/issues/1009
						ui.overlay.close(CHECKOUT_MODAL_ID);
					}}>
						{nameSearchResult.content.cta}
					</Button>
				</View>
			</BlockStack>
		</>
	);
};

export default NoMatchModalContent;
