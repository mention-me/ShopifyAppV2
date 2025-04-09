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
import { consoleError } from "../../../../shared/logging";
import { logError } from "../../../../shared/sentry";

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
        setErrorState,
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

            /**
             * For these partner codes, we want to pass an additional segment parameter. The segment parameter
             * is being used in the case to influence the Campaign we choose for the referee journey, and therefore
             * what offer the referee gets.
             *
             * Changing this? Check useRefereeFindFriend.tsx as well.
             *
             * See: https://mention-me.slack.com/archives/C0KGV2916/p1744187537168899
             */
            if (partnerCode === "mmaf551ce0") {
                params.set("request[segment]", "VIP");
            }

            const res = await fetch(`https://${url}/api/consumer/v2/referrer/search/content?${params.toString()}`, {
                method: "GET",
                // Sadly, Shopify have disabled credentials. This means we can't use cookies for anti fraud.
                // However, we'll pass it anyway, just in case they change their mind.
                credentials: "include",
                headers: { accept: "application/json", "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const message = `Error calling Referee SearchContent API. Response: ${res.status}, ${res.statusText}`;
                logError("RefereeEntryPoint", message, new Error(message));

                try {
                    const json = (await res.json()) as RefereeContent;

                    if (json.errors) {
                        consoleError(
                            "RefereeSearchContent",
                            "Errors returned from Mention Me API:",
                            json.errors.map((error) => error.message).join(", ")
                        );
                    }
                } catch {
                    // Do nothing
                }

                setErrorState(res.statusText);

                return null;
            }

            return (await res.json()) as RefereeContent;
        },
        throwOnError: true,
    });

    setRefereeContentApiResponse(data);
    setLoadingRefereeContentApi(isPending);
};
