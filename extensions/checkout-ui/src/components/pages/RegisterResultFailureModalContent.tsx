import { Heading, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import { useContext } from "react";
import DiscountCard from "./components/DiscountCard";
import { ErrorBoundary } from "@sentry/react";

const RegisterResultFailureModalContent = () => {
	const {
		registerResult,
	} = useContext(RefereeJourneyContext);

	return (
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "RegisterResultFailureModalContent");
		}}>
			<Heading level={1}>
				{registerResult.content["headline"]}
			</Heading>
			<TextBlock>
				{registerResult.content["detail"]}
			</TextBlock>
			<DiscountCard />
		</ErrorBoundary>
	);
};

export default RegisterResultFailureModalContent;
