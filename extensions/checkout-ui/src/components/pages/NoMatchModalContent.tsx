import { BlockStack, Button, Heading, TextBlock, useApi, View } from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import { CHECKOUT_MODAL_ID } from "../CheckoutModal";
import { decode } from "entities";
import { ErrorBoundary } from "@sentry/react";

const NoMatchModalContent = () => {
	const { ui } = useApi();

	const {
		mentionMeConfig,
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
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "NoMatchModalContent");
			scope.setTag("locale", mentionMeConfig.defaultLocale);
		}}>
			<Heading level={1}>
				{decode(nameSearchResult.content.headline)}
			</Heading>
			<TextBlock>
				{decode(nameSearchResult.content.description)}
			</TextBlock>

			<BlockStack>
				<View>
					<Button onPress={tryAgain}
					>
						{decode(nameSearchResult.content.back)}
					</Button>
				</View>
				<View>
					<Button onPress={() => {
						// Poorly documented function, see:
						// https://github.com/Shopify/ui-extensions/issues/1009
						ui.overlay.close(CHECKOUT_MODAL_ID);
					}}>
						{decode(nameSearchResult.content.cta)}
					</Button>
				</View>
			</BlockStack>
		</ErrorBoundary>
	);
};

export default NoMatchModalContent;
