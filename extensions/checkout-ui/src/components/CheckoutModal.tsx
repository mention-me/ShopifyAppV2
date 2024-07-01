import {
	Banner,
	BlockSpacer,
	BlockStack,
	Image,
	InlineLayout,
	InlineSpacer,
	Modal,
	TextBlock,
	useTranslate,
	View,
} from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { WhoAreYouModalContent } from "./WhoAreYouModalContent";
import { FindFriendModalContent } from "./FindFriendModalContent";
import { RegisterResultModalContent } from "./RegisterResultModalContent";
import NoMatchModalContent from "./NoMatchModalContent";

export const CHECKOUT_MODAL_ID = "been-referred-by-friend-modal";

export const CheckoutModal = () => {
	const { step, refereeEntryPointResponse } = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	const modalContent = useMemo(() => {
		if (step === "search-by-name") {
			return <FindFriendModalContent />;
		}

		if (step === "register") {
			return <WhoAreYouModalContent />;
		}

		if (step === "register-result") {
			return <RegisterResultModalContent />;
		}

		if (step === "no-match") {
			return <NoMatchModalContent />;
		}

		console.error("Unknown step", step);
		return <Banner status="critical"
					   title={translate("checkout.modal.error")} />;
	}, [step, translate]);

	return (
		<Modal
			id={CHECKOUT_MODAL_ID}
			padding
			title={refereeEntryPointResponse.defaultCallToAction}
		>
			<BlockStack
				padding="base"
			>
				<View>
					<Image borderRadius="large"
						   fit="contain"
						   source="https://static-demo.mention-me.com/assets/6682edf556ab5_img_2.png" />
				</View>
				{modalContent}
				<BlockSpacer spacing="extraLoose" />
				<View>
					<InlineLayout blockAlignment="start"
								  columns="auto"
								  maxBlockSize={5}
					>
						<TextBlock size="small">
							{translate("powered-by")}
						</TextBlock>
						<InlineSpacer spacing="extraTight" />
						<Image fit="cover"
							   source="https://static-demo.mention-me.com/assets/6682f07f33b76_img_1.png"
						/>
					</InlineLayout>
				</View>
			</BlockStack>
		</Modal>
	);

};
