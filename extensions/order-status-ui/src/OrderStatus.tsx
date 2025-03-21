import {
    useApi,
    useAppliedGiftCards,
    useCurrency,
    useCustomer,
    useDiscountAllocations,
    useDiscountCodes,
    useEmail,
    useExtensionEditor,
    useExtensionLanguage,
    useLanguage,
    useLocalizationCountry,
    useLocalizationMarket,
    useOrder,
    usePurchasingCompany,
    useShop,
    useTotalAmount,
    useTranslate,
} from "@shopify/ui-extensions-react/customer-account";

import ReferrerExperience from "./ReferrerExperience";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";
import { consoleError } from "../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";

export const OrderStatus = () => {
    const translate = useTranslate();

    const { myshopifyDomain } = useShop();

    // Setup sentry as soon as possible so that we can catch failures.
    setupSentry(myshopifyDomain, "order-status");

    const order = useOrder();
    const currency = useCurrency();
    const extensionLanguage = useExtensionLanguage();
    const language = useLanguage();
    const country = useLocalizationCountry();
    const market = useLocalizationMarket();

    // As per the B2B Checkout UI guide, we can identify B2B purchases by the presence of a purchasing company.
    // In this case, we want to turn off Mention Me features.
    // https://shopify.dev/docs/apps/build/b2b/create-checkout-ui
    const purchasingCompany = usePurchasingCompany();

    const { loading, mentionMeConfig } = useMentionMeShopifyConfig({
        myshopifyDomain,
        extension: "order-status",
        extensionLanguage: extensionLanguage.isoCode,
        language: language.isoCode,
        country: country?.isoCode,
        currency: currency.isoCode,
        marketId: market?.id,
        marketHandle: market?.handle,
    });

    const editor = useExtensionEditor();

    // There's a bug somewhere in Shopify which means that the billing address is no longer available on the Order Status page.
    // Raised here: https://community.shopify.dev/t/bug-billingaddress-is-no-longer-available-on-the-customer-order-status-page/6660
    // They've said that this should work instead (even though TypeScript says it won't)
    const api = useApi();
    const billingAddress = api?.billingAddress?.current || undefined;

    const { isoCode: languageOrLocale } = useLanguage();

    const email = useEmail();
    const customer = useCustomer();

    const money = useTotalAmount();

    const discountCodes = useDiscountCodes();
    const discountAllocations = useDiscountAllocations();

    const giftCards = useAppliedGiftCards();

    if (purchasingCompany) {
        consoleError(
            "OrderStatus",
            "Purchasing company found. We're in a B2B situation. Mention Me features will be disabled.",
            purchasingCompany
        );

        return null;
    }

    if (loading) {
        return <ReferrerExperience.Skeleton />;
    }

    if (!mentionMeConfig) {
        return null;
    }

    return (
        <ReferrerJourneyProvider mentionMeConfig={mentionMeConfig} orderId={order.id}>
            <ErrorBoundary
                beforeCapture={(scope, error) => {
                    consoleError("OrderStatus", "Error boundary caught error", error);

                    scope.setTag("component", "OrderStatus");
                }}
            >
                <ReferrerExperience
                    billingAddress={billingAddress}
                    country={country}
                    customer={customer}
                    discountAllocations={discountAllocations}
                    discountCodes={discountCodes}
                    editor={!!editor}
                    email={email}
                    extensionType="order-status"
                    giftCards={giftCards}
                    languageOrLocale={languageOrLocale}
                    money={money}
                    myshopifyDomain={myshopifyDomain}
                    translate={translate}
                />
            </ErrorBoundary>
        </ReferrerJourneyProvider>
    );
};
