import { Banner, useTranslate } from "@shopify/ui-extensions-react/checkout";
import { ErrorBoundary } from "@sentry/react";
import { ReactNode } from "react";
import { consoleError } from "../../../../shared/logging";

interface Props {
    readonly componentName: string;
    readonly children: React.PropsWithChildren<ReactNode>;
}

const ModalContent = ({ componentName, children }: Props) => {
    const translate = useTranslate();

    const fallback = <Banner status="critical" title={translate("checkout.modal.error")} />;

    return (
        <ErrorBoundary
            beforeCapture={(scope, error) => {
                consoleError(componentName, "Error boundary caught error", error);

                scope.setTag("component", componentName);
            }}
            fallback={fallback}
        >
            {children}
        </ErrorBoundary>
    );
};

export default ModalContent;
