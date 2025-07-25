import { Heading, TextBlock } from "@shopify/ui-extensions-react/checkout";
import { useContext } from "react";
import { RefereeJourneyContext } from "../../context/RefereeJourneyContext";
import RegisterResultFailureModalContent from "./RegisterResultFailureModalContent";
import DiscountCard from "./components/DiscountCard";
import { decode, EntityLevel } from "entities";
import { ErrorBoundary } from "@sentry/react";
import { consoleError } from "../../../../../shared/logging";

export const RegisterResultModalContent = () => {
    const { registerResult } = useContext(RefereeJourneyContext);

    if (registerResult?.result.status !== "Success") {
        return <RegisterResultFailureModalContent />;
    }

    return (
        <ErrorBoundary
            beforeCapture={(scope, error) => {
                consoleError("RegisterResultModalContent", "Error boundary caught error", error);

                scope.setTag("component", "RegisterResultModalContent");
            }}
        >
            <Heading level={1}>{decode(registerResult.content["headline"] || "", EntityLevel.HTML)}</Heading>
            <TextBlock>
                {decode(registerResult.content["fulfilled-also-emailed"] || "", EntityLevel.HTML)}{" "}
                {decode(registerResult.content["voucher-usage-restriction"] || "", EntityLevel.HTML)}
            </TextBlock>
            <DiscountCard />
        </ErrorBoundary>
    );
};
