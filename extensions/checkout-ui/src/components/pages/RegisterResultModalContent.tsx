import { Heading, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import RegisterResultFailureModalContent from "./RegisterResultFailureModalContent";
import DiscountCard from "./components/DiscountCard";
import { decode } from "entities";
import { ErrorBoundary } from "@sentry/react";
import { setScopeTags } from "../../../../../shared/sentry";

export const RegisterResultModalContent = () => {
	const {
		mentionMeConfig,
		registerResult,
	} = useContext(RefereeJourneyContext);

	if (registerResult?.result.status !== "Success") {
		return <RegisterResultFailureModalContent />;
	}

	return (
		<ErrorBoundary beforeCapture={(scope) => {
			scope.setTag("component", "RegisterResultModalContent");
			
			setScopeTags(scope, mentionMeConfig);
		}}>
			<Heading level={1}>
				{decode(registerResult.content["headline"] || "")}
			</Heading>
			<TextBlock>
				{decode(registerResult.content["fulfilled-also-emailed"] || "")}
				{" "}
				{decode(registerResult.content["voucher-usage-restriction"] || "")}
			</TextBlock>
			<DiscountCard />
		</ErrorBoundary>
	);
};
