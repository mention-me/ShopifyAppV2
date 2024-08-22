import { Heading, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import { useContext } from "react";
import DiscountCard from "./components/DiscountCard";
import { ErrorBoundary } from "@sentry/react";
import { setScopeTags } from "../../../../../shared/sentry";
import { consoleError } from "../../../../../shared/logging";

const RegisterResultFailureModalContent = () => {
	const {
		mentionMeConfig,
		registerResult,
	} = useContext(RefereeJourneyContext);

	return (
		<ErrorBoundary beforeCapture={(scope, error) => {
			consoleError("RegisterResultFailureModalContent", "Error boundary caught error", error);

			scope.setTag("component", "RegisterResultFailureModalContent");

			setScopeTags(scope, mentionMeConfig);
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
