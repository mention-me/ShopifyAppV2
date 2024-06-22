import { Banner, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { WhoAreYouModal } from "./WhoAreYouModal";
import { FindFriendModal } from "./FindFriendModal";
import { RegisterResultModal } from "./RegisterResultModal";

export const CheckoutModal = () => {
	const { step } = useContext(RefereeJourneyContext);

	const translate = useTranslate();

	if (step === "search-by-name" || step === "search-by-name-and-email") {
		return <FindFriendModal />;
	}

	if (step === "register") {
		return <WhoAreYouModal />;
	}

	if (step === "register-result") {
		return <RegisterResultModal />;
	}

	console.error("Unknown step", step);
	return <Banner status="critical"
				   title={translate("checkout.modal.error")} />;
};
