import { Banner, Heading, Link, SkeletonTextBlock, TextBlock } from "@shopify/ui-extensions-react/checkout";

import { decode, EntityLevel } from "entities";
import { useContext } from "react";
import { ReferrerJourneyContext } from "./context/ReferrerJourneyContext";
import useReferrerEntryPoint from "./hooks/useReferrerEntryPoint";
import { consoleError } from "../../../shared/logging";

import { ExtensionType } from "../../../shared/types";
import { ErrorBoundary } from "@sentry/react";
import {
    AppliedGiftCard,
    CartDiscountAllocation,
    CartDiscountCode,
    CartLine,
    Country,
    Customer,
    Money,
} from "@shopify/ui-extensions/build/ts/surfaces/checkout/api/standard/standard";
import { MailingAddress } from "@shopify/ui-extensions/build/ts/surfaces/checkout/api/shared";
import { I18nTranslate } from "@shopify/ui-extensions/src/surfaces/checkout/api/standard/standard";
import { Modal } from "@shopify/ui-extensions/checkout";
import ReferrerExperience from "./ReferrerExperience";

export interface ReferrerEntryPointInputs {
    /* eslint-disable react/no-unused-prop-types */
    readonly billingAddress: MailingAddress;
    readonly cartLines?: CartLine[];
    readonly country: Country;
    readonly customer: Pick<Customer, "id">;
    readonly discountAllocations: CartDiscountAllocation[];
    readonly discountCodes: CartDiscountCode[];
    readonly giftCards: AppliedGiftCard[];
    readonly editor: boolean;
    readonly email: string;
    readonly extensionType: ExtensionType;
    readonly languageOrLocale: string;
    readonly total: Money;
    readonly segment: string;
    readonly subTotal: Money | undefined;
    readonly totalTaxAmount: Money | undefined;
    readonly totalShippingAmount: Money | undefined;
    readonly myshopifyDomain: string;
    readonly translate: I18nTranslate;
    /* eslint-enable react/no-unused-prop-types */
}

const ReferrerExperienceAnnouncement = (props: ReferrerEntryPointInputs) => {
    const { editor } = props;

    const { partnerCode, environment, errorState } = useContext(ReferrerJourneyContext);

    const { loading, data } = useReferrerEntryPoint(props);

    // Now we're into the rendering part

    if (!environment || typeof environment !== "string") {
        if (editor) {
            return (
                <Banner
                    status="critical"
                    title="Mention Me environment not set. Visit the Mention Me app settings in Shopify to choose an environment."
                />
            );
        }

        consoleError("Extension", "Invalid environment set", environment);
        return null;
    }

    if (!partnerCode || typeof partnerCode !== "string") {
        if (editor) {
            return (
                <Banner
                    status="critical"
                    title="Mention Me partner code needs to be set to show Mention Me journey. Visit the Mention Me app settings in Shopify to set the partner code."
                />
            );
        }

        consoleError("Extension", "Invalid Mention Me Partner Code set", partnerCode);
        return null;
    }

    if (errorState) {
        if (editor) {
            return (
                <Banner
                    status="critical"
                    title="Failed to load Mention Me journey. An offer might not be available for your locale, or your integration is not enabled."
                />
            );
        }

        return null;
    }

    if (loading) {
        return <ReferrerExperienceAnnouncement.Skeleton />;
    }

    if (!data) {
        return null;
    }

    return (
        <ErrorBoundary
            beforeCapture={(scope, error) => {
                consoleError("OrderExtension", "Error boundary caught error", error);

                scope.setTag("component", "OrderExtension");
            }}
        >
            <Heading level={2}>
                <TextBlock>
                    {decode(data.headline, EntityLevel.HTML)}{" "}
                    <Link
                        overlay={
                            <Modal id="referrer-modal" title={decode(data.headline, EntityLevel.HTML)}>
                                <ReferrerExperience announcement {...props} />
                            </Modal>
                        }
                    >
                        {decode(data.defaultCallToAction, EntityLevel.HTML)}
                    </Link>
                </TextBlock>

            </Heading>
        </ErrorBoundary>
    );
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
ReferrerExperienceAnnouncement.Skeleton = () => {
    return (
        <Heading level={2}>
            <SkeletonTextBlock lines={1} />
        </Heading>
    );
};

export default ReferrerExperienceAnnouncement;
