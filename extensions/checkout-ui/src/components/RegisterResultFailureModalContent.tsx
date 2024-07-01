import { Heading, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { useContext } from "react";
import DiscountCard from "./DiscountCard";

const RegisterResultFailureModalContent = () => {
	const {
		registerResult,
	} = useContext(RefereeJourneyContext);

	return (
		<>
			<Heading level={1}>
				{registerResult.content["headline"]}
			</Heading>
			<TextBlock>
				{registerResult.content["detail"]}
			</TextBlock>
			<DiscountCard />
		</>
	);
};

export default RegisterResultFailureModalContent;
