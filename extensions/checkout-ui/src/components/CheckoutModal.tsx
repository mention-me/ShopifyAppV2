import { Banner, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { WhoAreYouModal } from "./WhoAreYouModal";
import { FindFriendModal } from "./FindFriendModal";

export const CheckoutModal = () => {
	const { step } = useContext(RefereeJourneyContext);

	if (step === "search-by-name" || step === "search-by-name-and-email") {
		return <FindFriendModal />;
	}

	if (step === "register") {
		return <WhoAreYouModal />;
	}

	if (step === "no-match") {
		return <TextBlock>No luck mate.</TextBlock>;
	}

	console.error("Unknown step", step);
	return <Banner title="Something went wrong." status="critical" />;
};
