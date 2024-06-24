import { Banner, BlockStack, Modal, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { useContext, useMemo } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { WhoAreYouModalContent } from "./WhoAreYouModalContent";
import { FindFriendModalContent } from "./FindFriendModalContent";
import { RegisterResultModalContent } from "./RegisterResultModalContent";

export const CheckoutModal = () => {
	const { step, nameSearchResult, registerResult } = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	const modalContent = useMemo(() => {
		if (step === "search-by-name" || step === "search-by-name-and-email") {
			return <FindFriendModalContent />;
		}

		if (step === "register") {
			return <WhoAreYouModalContent />;
		}

		if (step === "register-result") {
			return <RegisterResultModalContent />;
		}

		console.error("Unknown step", step);
		return <Banner status="critical"
					   title={translate("checkout.modal.error")} />;
	}, [step, translate]);

	const modalTitle = useMemo(() => {
		if (step === "search-by-name" || step === "search-by-name-and-email") {
			return translate("modal.title.welcome");
		}

		if (step === "register") {
			return nameSearchResult.content.headline || translate("modal.title.register");
		}

		if (step === "register-result") {
			if (registerResult?.result.status !== "success") {
				return registerResult.content.headline || translate("modal.title.register-result.failure");
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return registerResult.result?.refereeReward?.description || translate("modal.title.register-result.success");
		}

		return "";
	}, [step, registerResult, nameSearchResult, translate]);

	return (
		<Modal
			padding
			title={modalTitle}
		>
			<BlockStack spacing="base">
				{modalContent}
			</BlockStack>
		</Modal>
	);

};
