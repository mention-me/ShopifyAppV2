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

const useReferrerEntryPoint = ({
    myshopifyDomain,
    email,
    billingAddress,
    money,
    editor,
    discountAllocations,
    discountCodes,
    customer,
    languageOrLocale,
    country,
    extensionType,
}: ReferrerEntryPointInputs) => {
    const { orderId, partnerCode, environment, defaultLocale, localeChoiceMethod, setErrorState } =
        useContext(ReferrerJourneyContext);

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
            money,
            editor,
            discountCodes,
            discountAllocations,
            extensionType,
            customer,
        ],
        queryFn: async (): Promise<EntryPointOfferAndLink> => {
            // The Mention Me API supports multiple discount codes, comma separated.
            const codes = discountCodes
                .map((discountCode) => {
                    return discountCode.code;
                })
                .join(",");

            const discountAmount = discountAllocations.reduce((total, currentValue) => {
                return total + currentValue.discountedAmount.amount;
            }, 0);

            const customField = [myshopifyDomain];

            if (!partnerCode || !environment || !locale) {
                return null;
            }

            if (!money || (!money.amount && money.amount !== 0) || !money.currencyCode) {
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
                    currencyCode: money?.currencyCode,
                    // When we're in the editor, don't record a value. This is to prevent these values being counted
                    // as real orders.
                    total: editor ? "0" : String(money?.amount),
                    // Use the time of the request instead of explicitly setting a time.
                    dateString: "",
                    couponCode: codes,
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
