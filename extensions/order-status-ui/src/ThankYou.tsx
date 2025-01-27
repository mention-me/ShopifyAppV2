import ReferrerExperience from "./ReferrerExperience";
import {
    useApi,
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
    usePurchasingCompany,
    useShop,
    useSubscription,
    useTotalAmount,
    useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { ReferrerJourneyProvider } from "./context/ReferrerJourneyContext";
import { setupSentry } from "../../../shared/sentry";
import { useMentionMeShopifyConfig } from "../../../shared/hooks/useMentionMeShopifyConfig";
import { consoleError } from "../../../shared/logging";
import { ErrorBoundary } from "@sentry/react";

export const ThankYou = () => {
    const translate = useTranslate();

    const { myshopifyDomain } = useShop();

    // Setup sentry as soon as possible so that we can catch failures.
    setupSentry(myshopifyDomain, "thank-you");

    const { orderConfirmation } = useApi("purchase.thank-you.block.render");
    const { order } = useSubscription(orderConfirmation);

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

    const { isoCode: languageOrLocale } = useLanguage();

	const billingAddress = useBillingAddress();

    const email = useEmail();
    const customer = useCustomer();

    const money = useTotalAmount();

    const discountCodes = useDiscountCodes();
    const discountAllocations = useDiscountAllocations();

    if (purchasingCompany) {
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
                    consoleError("ThankYou", "Error boundary caught error", error);

                    scope.setTag("component", "ThankYou");
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
                    extensionType="thank-you"
                    languageOrLocale={languageOrLocale}
                    money={money}
                    myshopifyDomain={myshopifyDomain}
                    translate={translate}
                />
            </ErrorBoundary>
        </ReferrerJourneyProvider>
    );
};
