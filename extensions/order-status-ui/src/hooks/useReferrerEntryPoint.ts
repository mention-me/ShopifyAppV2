import { useContext } from "react";
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment, parseShopifyId } from "../../../../shared/utils";
import useLocale from "../../../../shared/hooks/useLocale";
import { ReferrerJourneyContext } from "../context/ReferrerJourneyContext";
import { consoleError } from "../../../../shared/logging";
import { ReferrerEntryPointInputs } from "../ReferrerExperience";
import { logError } from "../../../../shared/sentry";
import { useQuery } from "@tanstack/react-query";

// Create a safe execution context
const safeEval = (code: string, partnerCode: string, environment: string, orderId: string) => {
    // Create a function with limited scope
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(
        "partnerCode",
        "environment",
        "orderId",
        `
            "use strict";
            try {
                ${code}
            } catch (e) {
                console.error('Custom code execution error:', e);
                return {};
            }
        `
    );

    try {
        // Execute with only allowed parameters
        const r = fn(partnerCode, environment, orderId);

        if (r && typeof r === "object") {
            return r;
        }
    } catch (e) {}

    return {};
};

const useReferrerEntryPoint = ({
    myshopifyDomain,
    email,
    billingAddress,
    segment,
    total,
    subTotal,
    totalTaxAmount,
    totalShippingAmount,
    editor,
    discountAllocations,
    discountCodes,
    giftCards,
    customer,
    languageOrLocale,
    country,
    extensionType,
}: ReferrerEntryPointInputs) => {
    const {
        orderId,
        partnerCode,
        environment,
        defaultLocale,
        localeChoiceMethod,
        orderTotalTrackingType,
        customCode,
        setErrorState,
    } = useContext(ReferrerJourneyContext);

    const locale = useLocale(languageOrLocale, country?.isoCode, defaultLocale, localeChoiceMethod);

    const { isPending, data } = useQuery<EntryPointOfferAndLink>({
        queryKey: [
            "referrerContent",
            partnerCode,
            environment,
            myshopifyDomain,
            locale,
            setErrorState,
            email,
            billingAddress?.firstName,
            billingAddress?.lastName,
            billingAddress?.zip,
            orderId,
            segment,
            total,
            subTotal,
            totalTaxAmount,
            totalShippingAmount,
            editor,
            discountCodes,
            discountAllocations,
            giftCards,
            extensionType,
            customer,
        ],
        queryFn: async (): Promise<EntryPointOfferAndLink> => {
            let finalSegment = segment;

            // Execute custom code if provided
            if (customCode) {
                try {
                    const customResults = safeEval(customCode, partnerCode, environment, parseShopifyId(orderId));

                    // Only allow overriding segment
                    if (customResults && "segment" in customResults && typeof customResults.segment === "string") {
                        finalSegment = customResults.segment;
                    }
                } catch (error) {
                    consoleError("ReferrerEntryPoint", "Custom code execution failed", error);
                }
            }

            // The Mention Me API supports multiple discount codes, comma separated.
            const codes = discountCodes.map((discountCode) => {
                return discountCode.code;
            });

            /*
             * Some clients use gift cards as a way to provide discounts. This isn't necessarily a good idea because
             * Shopify's controls are more limited with gift cards. They also don't provide the full code in the API
             * (probably because it's sensitive and might still have money on it) - they only provide the last 4
             * characters.
             *
             * We capture this to try and provide a better debugging experience of tracking down when someone uses a
             * gift card.
             */
            const giftCardChars = giftCards.map((giftCard) => {
                return giftCard.lastCharacters;
            });

            const couponCodesList = codes.concat(giftCardChars);

            const discountAmount = discountAllocations.reduce((total, currentValue) => {
                return total + currentValue.discountedAmount.amount;
            }, 0);

            const totalAmount = String(total?.amount);
            const subTotalAmount = String(
                Math.max(total?.amount - totalTaxAmount?.amount - totalShippingAmount?.amount, 0)
            );

            const customField = [myshopifyDomain, totalAmount, subTotalAmount];

            const orderTotal = orderTotalTrackingType === "sub_total" ? subTotal.amount : total.amount;

            if (!partnerCode || !environment || !locale) {
                return null;
            }

            if (!total || (!total.amount && total.amount !== 0) || !total.currencyCode) {
                // There's a behaviour in the Shopify API where "money" is undefined until the order is fully loaded.
                // See: https://github.com/Shopify/ui-extensions/issues/2203
                return null;
            }

            const body: EntryPointForReferrerType = {
                customer: {
                    emailAddress: email,
                    firstname: billingAddress?.firstName,
                    surname: billingAddress?.lastName,
                    uniqueIdentifier: customer ? parseShopifyId(customer.id) : undefined,
                    customField: customField.join("|"),
                    segment: finalSegment,
                },
                request: {
                    partnerCode: partnerCode,
                    situation: `shopify-${extensionType}`,
                    appName: APP_NAME + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
                    appVersion: `${myshopifyDomain}/${APP_VERSION}`,
                    localeCode: locale,
                },
                implementation: {
                    wrapContentWithBranding: true,
                    showCloseIcon: false,
                },
                address: {
                    addressLine1: billingAddress?.address1,
                    addressLine2: billingAddress?.address2,
                    addressCity: billingAddress?.city,
                    addressCounty: billingAddress?.provinceCode,
                    addressPostCode: billingAddress?.zip,
                    addressCountry: billingAddress?.countryCode,
                },
                order: {
                    orderIdentifier: parseShopifyId(orderId),
                    currencyCode: total?.currencyCode,
                    // When we're in the editor, don't record a value. This is to prevent these values being counted
                    // as real orders.
                    total: editor ? "0" : orderTotal,
                    // Use the time of the request instead of explicitly setting a time.
                    dateString: "",
                    couponCode: couponCodesList.join(","),
                    discountAmount: String(discountAmount),
                },
            };

            if (!partnerCode || typeof partnerCode !== "string") {
                consoleError("ReferrerEntryPoint", "Mention Me partner code not provided", partnerCode);
                return null;
            }

            if (!isValidEnvironment(environment)) {
                consoleError("ReferrerEntryPoint", "Invalid Mention Me environment", environment);
                return null;
            }

            const url = getDomainForEnvironment(myshopifyDomain, environment);

            const response = await fetch(`https://${url}/api/entry-point/v2/offer`, {
                method: "POST",
                credentials: "include",
                headers: { accept: "application/json", "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const message = `Error calling Referrer EntryPoint. Response: ${response.status}, ${response.statusText}`;
                logError("ReferrerEntryPoint", message, new Error(message));

                setErrorState(true);
                return null;
            }

            return (await response.json()) as EntryPointOfferAndLink;
        },
    });

    return {
        loading: isPending,
        data,
    };
};

export default useReferrerEntryPoint;
