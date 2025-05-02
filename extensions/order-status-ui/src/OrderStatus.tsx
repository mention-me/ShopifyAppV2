import {
    useApi,
    useAppliedGiftCards,
    useBillingAddress,
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
    useSettings,
    useShop,
    useSubscription,
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

    const billingAddress = useBillingAddress();

    const { isoCode: languageOrLocale } = useLanguage();

    const email = useEmail();
    const customer = useCustomer();

    const totalAmount = useTotalAmount();

    // Subtotal Amount isn't supported on the order status, but exists - so we can get it ourselves.
    // Request is here: https://community.shopify.dev/t/support-for-usesubtotalamount-on-order-status-page/13618
    const api = useApi();
    const subTotalAmount = useSubscription(api?.cost.subtotalAmount) || undefined;
    const shippingAmount = useSubscription(api?.cost.totalShippingAmount) || undefined;
    const taxAmount = useSubscription(api?.cost.totalTaxAmount) || undefined;

    const discountCodes = useDiscountCodes();
    const discountAllocations = useDiscountAllocations();

    const giftCards = useAppliedGiftCards();

    const {
        image_location: imageLocation,
    }: Partial<{
        image_location: "Top" | "Above information notice" | "Above CTA" | "Below CTA";
    }> = useSettings();

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
        <ReferrerJourneyProvider imageLocation={imageLocation} mentionMeConfig={mentionMeConfig} orderId={order.id}>
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
                    myshopifyDomain={myshopifyDomain}
                    subTotal={subTotalAmount}
                    total={totalAmount}
                    totalShippingAmount={shippingAmount}
                    totalTaxAmount={taxAmount}
                    translate={translate}
                />
            </ErrorBoundary>
        </ReferrerJourneyProvider>
    );
};
