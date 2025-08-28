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
	View,
} from "@shopify/ui-extensions-react/checkout";

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
import { ConditionalWrapper } from "./ConditionalWrapper";

export interface ReferrerEntryPointInputs {
	readonly announcement?: boolean;
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

const ReferrerExperience = (props: ReferrerEntryPointInputs) => {
	const { announcement, editor, translate } = props;

	const { partnerCode, environment, errorState, imageLocation } = useContext(ReferrerJourneyContext);

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
		console.log("Loading");
		return <ReferrerExperience.Skeleton />;
	}

	if (!data) {
		console.log("No data");
		return null;
	}

	return (
		<ErrorBoundary
			beforeCapture={(scope, error) => {
				consoleError("OrderExtension", "Error boundary caught error", error);

				scope.setTag("component", "OrderExtension");
			}}
		>
			<ConditionalWrapper shouldWrap={!announcement} wrapper={(children) => (<View background="base">
				<BlockStack border="base" borderRadius="large">
					{children}
				</BlockStack>
			</View>)}>

				{imageLocation === "Top" && data.imageUrl && (
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
				<View borderRadius="none">
					<BlockStack padding="loose" spacing="base">
						{!announcement && <Heading level={2}>
							{decode(data.headline, EntityLevel.HTML)}
						</Heading>}
						<TextBlock>{decode(data.description, EntityLevel.HTML)}</TextBlock>

						{imageLocation === "Above information notice" && data.imageUrl && (
							<View>
								<Link external to={data.url}>
									<Image
										aspectRatio={1.5}
										borderRadius={["large", "large", "large", "large"]}
										cornerRadius={["large", "large", "large", "large"]}
										fit="cover"
										source={data.imageUrl}
									/>
								</Link>
							</View>
						)}

						<Pressable
							overlay={
								<Popover>
									<View maxInlineSize={400} padding="base">
										<TextBlock appearance="subdued">
											{data.privacyNotice}{" "}
											<Link external to={data.privacyNoticeUrl}>
												{decode(
													data.privacyNoticeLinkText ||
													"More info and your privacy rights",
													EntityLevel.HTML,
												)}
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

						{imageLocation === "Above CTA" && data.imageUrl && (
							<View>
								<Link external to={data.url}>
									<Image
										aspectRatio={1.5}
										borderRadius={["large", "large", "large", "large"]}
										cornerRadius={["large", "large", "large", "large"]}
										fit="cover"
										source={data.imageUrl}
									/>
								</Link>
							</View>
						)}

						<View blockAlignment="center">
							{/*
                                Button can't support "external".
                                See https://github.com/Shopify/ui-extensions/issues/1835#issuecomment-2113067449
                                And because Link can't be full width, the button is restricted in size :(
                                */}
							<Link external to={data.url}>
								<Button inlineAlignment="center">
									{decode(data.defaultCallToAction, EntityLevel.HTML)}
								</Button>
							</Link>
						</View>
					</BlockStack>
				</View>

				{imageLocation === "Below CTA" && data.imageUrl && (
					<View>
						<Link external to={data.url}>
							<Image
								aspectRatio={1.5}
								borderRadius={["none", "none", "large", "large"]}
								cornerRadius={["none", "none", "large", "large"]}
								fit="cover"
								source={data.imageUrl}
							/>
						</Link>
					</View>
				)}
			</ConditionalWrapper>
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
