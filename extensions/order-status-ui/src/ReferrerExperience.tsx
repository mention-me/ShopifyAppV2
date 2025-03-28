import {
    Banner,
    BlockStack,
    Button,
    Heading,
    Icon,
    Image,
    InlineStack,
    Link,
    Popover,
    Pressable,
    SkeletonImage,
    SkeletonTextBlock,
    TextBlock,
    useTranslate as useTranslateCheckout,
    View,
} from "@shopify/ui-extensions-react/checkout";

import { useTranslate as useTranslateCustomerAccount } from "@shopify/ui-extensions-react/customer-account";
import { useContext } from "react";
import { ReferrerJourneyContext } from "./context/ReferrerJourneyContext";
import useReferrerEntryPoint from "./hooks/useReferrerEntryPoint";
import { consoleError } from "../../../shared/logging";

import { ExtensionType } from "../../../shared/types";
import { ErrorBoundary } from "@sentry/react";
import {
    CartDiscountAllocation,
    CartDiscountCode,
    AppliedGiftCard,
    Country,
    Customer,
    Money,
} from "@shopify/ui-extensions/build/ts/surfaces/checkout/api/standard/standard";
import { MailingAddress } from "@shopify/ui-extensions/build/ts/surfaces/checkout/api/shared";

export interface ReferrerEntryPointInputs {
    /* eslint-disable react/no-unused-prop-types */
    readonly billingAddress: MailingAddress;
    readonly country: Country;
    readonly customer: Pick<Customer, "id">;
    readonly discountAllocations: CartDiscountAllocation[];
    readonly discountCodes: CartDiscountCode[];
    readonly giftCards: AppliedGiftCard[];
    readonly editor: boolean;
    readonly email: string;
    readonly extensionType: ExtensionType;
    readonly languageOrLocale: string;
    readonly money: Money;
    readonly myshopifyDomain: string;
    readonly translate: ReturnType<typeof useTranslateCheckout> | ReturnType<typeof useTranslateCustomerAccount>;
    /* eslint-enable react/no-unused-prop-types */
}

const ReferrerExperience = (props: ReferrerEntryPointInputs) => {
    const { editor, translate } = props;

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
        return <ReferrerExperience.Skeleton />;
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
            <View background="base">
                <BlockStack border="base" borderRadius="large">
                    {data.imageUrl && (
                        <View>
                            <Link external to={data.url}>
                                <Image
                                    aspectRatio={1.5}
                                    borderRadius={["large", "large", "none", "none"]}
                                    cornerRadius={["large", "large", "none", "none"]}
                                    fit="cover"
                                    source={data.imageUrl}
                                />
                            </Link>
                        </View>
                    )}
                    <View borderRadius="large">
                        <BlockStack padding="loose" spacing="base">
                            <Heading level={2}>{data.headline}</Heading>
                            <TextBlock>{data.description}</TextBlock>
                            <Pressable
                                overlay={
                                    <Popover>
                                        <View maxInlineSize={400} padding="base">
                                            <TextBlock appearance="subdued">
                                                {data.privacyNotice}{" "}
                                                <Link external to={data.privacyNoticeUrl}>
                                                    {data.privacyNoticeLinkText || "More info and your privacy rights"}
                                                </Link>
                                            </TextBlock>
                                        </View>
                                    </Popover>
                                }
                            >
                                <InlineStack padding={["extraTight", "none"]} spacing="extraTight">
                                    <TextBlock appearance="subdued" size="small">
                                        {translate("managed-by")}
                                    </TextBlock>

                                    <Icon source="question" />
                                </InlineStack>
                            </Pressable>

                            <View blockAlignment="center" minBlockSize="fill">
                                {/*
							Button can't support "external".
							See https://github.com/Shopify/ui-extensions/issues/1835#issuecomment-2113067449
						 	And because Link can't be full width, the button is restricted in size :(
						 	*/}
                                <Link external to={data.url}>
                                    <Button inlineAlignment="center">{data.defaultCallToAction}</Button>
                                </Link>
                            </View>
                        </BlockStack>
                    </View>
                </BlockStack>
            </View>
        </ErrorBoundary>
    );
};

// eslint-disable-next-line react/display-name,react/no-multi-comp
ReferrerExperience.Skeleton = () => {
    return (
        <View background="base">
            <BlockStack border="base" borderRadius="large">
                <SkeletonImage blockSize={250} inlineSize={800} />
                <View borderRadius="large">
                    <BlockStack padding="loose" spacing="base">
                        <Heading level={2}>
                            <SkeletonTextBlock lines={1} />
                        </Heading>
                        <TextBlock>
                            <SkeletonTextBlock lines={2} />
                        </TextBlock>

                        <View background="subdued" borderRadius="large" padding="tight">
                            <InlineStack padding="extraTight" spacing="extraTight">
                                <TextBlock appearance="subdued">
                                    <SkeletonTextBlock lines={1} />
                                </TextBlock>
                            </InlineStack>
                        </View>

                        <View blockAlignment="center" minBlockSize="fill">
                            <Button inlineAlignment="center">
                                <SkeletonTextBlock lines={2} />
                            </Button>
                        </View>
                    </BlockStack>
                </View>
            </BlockStack>
        </View>
    );
};

export default ReferrerExperience;
