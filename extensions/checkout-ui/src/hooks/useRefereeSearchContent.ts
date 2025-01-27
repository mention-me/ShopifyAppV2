import { SITUATION } from "../Checkout";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { RefereeContent } from "@api/consumer-api/src/types";
import { useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import {
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useShop,
} from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { useQuery } from "@tanstack/react-query";

/**
 * Function to call the Mention Me Referee EntryPoint API.
 *
 * This will return a CTA for this specific locale, which will be something similar to "Been referred by a friend?".
 *
 * It will also return a URL, but we will ignore this as we will use the Consumer API to build our own fully fledged UI
 * using Shopify components.
 */
export const useRefereeSearchContent = () => {
    const {
        partnerCode,
        environment,
        defaultLocale,
        localeChoiceMethod,
        setLoadingRefereeContentApi,
        setRefereeContentApiResponse,
    } = useContext(RefereeJourneyContext);

    const { myshopifyDomain } = useShop();

    const editor = useExtensionEditor();

    const { isoCode: languageOrLocale } = useLanguage();
    const country = useLocalizationCountry();

    const locale = useLocale(languageOrLocale, country?.isoCode, defaultLocale, localeChoiceMethod);

    const url = getDomainForEnvironment(myshopifyDomain, environment);

    const { isPending, data } = useQuery<RefereeContent>({
        queryKey: ["refereeContent", partnerCode, editor, myshopifyDomain, locale, environment],
        queryFn: async (): Promise<RefereeContent> => {
            if (!partnerCode || typeof partnerCode !== "string") {
                return null;
            }

            if (!isValidEnvironment(environment)) {
                return null;
            }

            if (!locale) {
                return null;
            }

            const params = new URLSearchParams({
                "request[partnerCode]": partnerCode,
                "request[situation]": SITUATION,
                "request[appName]": APP_NAME + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
                "request[appVersion]": `${myshopifyDomain}/${APP_VERSION}`,
                "request[localeCode]": locale,
            });

            const res = await fetch(`https://${url}/api/consumer/v2/referrer/search/content?${params.toString()}`, {
                method: "GET",
                // Sadly, Shopify have disabled credentials. This means we can't use cookies for anti fraud.
                // However, we'll pass it anyway, just in case they change their mind.
                credentials: "include",
                headers: { accept: "application/json", "Content-Type": "application/json" },
            });

            return (await res.json()) as RefereeContent;
        },
        throwOnError: true,
    });

    setLoadingRefereeContentApi(isPending);
    setRefereeContentApiResponse(data);
};
