import { Banner, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { ErrorBoundary } from "@sentry/react";
import { ReactNode, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { setScopeTags } from "../../../../shared/sentry";
import { consoleError } from "../../../../shared/logging";

interface Props {
	readonly componentName: string;
	readonly children: React.PropsWithChildren<ReactNode>;
}

const ModalContent = ({ componentName, children }: Props) => {
	const translate = useTranslate();
	const { mentionMeConfig } = useContext(RefereeJourneyContext);


	const fallback = <Banner status="critical"
							 title={translate("checkout.modal.error")} />;

	return (
		<ErrorBoundary beforeCapture={(scope, error) => {
			consoleError(componentName, "Error boundary caught error", error);

			scope.setTag("component", componentName);

			setScopeTags(scope, mentionMeConfig);
		}}
					   fallback={fallback}>
			{children}
		</ErrorBoundary>
	);
};

export default ModalContent;
