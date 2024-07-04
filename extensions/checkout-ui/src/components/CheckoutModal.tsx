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
	const { step, refereeEntryPointResponse, mentionMeConfig } = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	const modalContent = useMemo(() => {
		if (step === "search-by-name" || step === "duplicate-match" || step === "no-match") {
			return <FindFriendModalContent />;
		}

		if (step === "register") {
			return <WhoAreYouModalContent />;
		}

		if (step === "register-result") {
			return <RegisterResultModalContent />;
		}

		if (step === "no-match-final") {
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
				{/*
				No amount of faffing around with maxBlockSize seems to constrain the height of the image,
				so it's assumed you've already got the image the right height.
				*/}
				{mentionMeConfig?.refereeModalImage && (
					<>
						<View>
							<Image borderRadius="large"
								   fit="cover"
								   source={mentionMeConfig.refereeModalImage} />
						</View>
						<BlockSpacer />
					</>
				)}
				{modalContent}
				<BlockSpacer spacing="extraLoose" />
				<View display="inline">
					<InlineLayout blockAlignment="start"
								  columns="auto"
								  maxBlockSize={5}
					>
						<TextBlock size="small">
							{translate("powered-by")}
						</TextBlock>
						<InlineSpacer spacing="extraTight" />
						<Image fit="cover"
							   source="https://static.mention-me.com/shopify-app/mention-me-logo.svg"
						/>
					</InlineLayout>
				</View>
			</BlockStack>
		</Modal>
	);

};
