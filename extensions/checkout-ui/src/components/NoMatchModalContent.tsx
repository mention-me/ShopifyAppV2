import { BlockStack, Button, Heading, TextBlock, useTranslate, View } from "@shopify/ui-extensions-react/checkout";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";

const NoMatchModalContent = () => {
	const translate = useTranslate();

	const {
		setStep,
		setModalVisible,
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
						setModalVisible(false);
					}}>
						{translate("no-match.continue-shopping")}
					</Button>
				</View>
			</BlockStack>
		</>
	);
};

export default NoMatchModalContent;
