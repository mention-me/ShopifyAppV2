import { SITUATION } from "../Checkout";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { RefereeContent } from "@api/consumer-api/src/types";
import { useContext, useEffect } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { useExtensionEditor, useShop } from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { useLanguage, useLocalizationCountry } from "@shopify/ui-extensions-react/checkout";
import { consoleError } from "../../../../shared/logging";
import { logError } from "../../../../shared/sentry";
import { useQuery } from "@tanstack/react-query";
import { MentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";

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
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	const editor = useExtensionEditor();

	const { isoCode: languageOrLocale } = useLanguage();
	const country = useLocalizationCountry();

	const locale = useLocale(languageOrLocale, country?.isoCode, defaultLocale, localeChoiceMethod);

	const url = getDomainForEnvironment(myshopifyDomain, environment);

	const params = new URLSearchParams({
		"request[partnerCode]": partnerCode,
		"request[situation]": SITUATION,
		"request[appName]": APP_NAME  + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
		"request[appVersion]": `${myshopifyDomain}/${APP_VERSION}`,
		"request[localeCode]": locale,
	});


	const { isPending, error, data } = useQuery<RefereeContent>({
		queryKey: ["refereeContent"],
		queryFn: async (): Promise<RefereeContent> => {
			if (!partnerCode || typeof partnerCode !== "string") {
				return undefined;
			}

			if (!isValidEnvironment(environment)) {
				return undefined;
			}

			if (!locale) {
				return undefined;
			}

			const res = await fetch(`https://${url}/api/consumer/v2/referrer/search/content?${params.toString()}`,
				{
					method: "GET",
					// Sadly, Shopify have disabled credentials. This means we can't use cookies for anti fraud.
					// However, we'll pass it anyway, just in case they change their mind.
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
				},
			);

			return (await res.json()) as RefereeContent;
		},
	});

	return {
		loading: isPending,
		refereeContentApiResponse: data,
	}

			// 	if (!response.ok) {
			// 		const message = `Error calling Referee SearchContent API. Response: ${response.status}, ${response.statusText}`;
			// 		logError("ReferrerEntryPoint", message, new Error(message));
			//
			// 		try {
			// 			const json = (await response.json()) as RefereeContent;
			//
			// 			if (json.errors) {
			// 				consoleError("RefereeSearchContent", "Errors returned from Mention Me API:", json.errors.map((error) => error.message).join(", "));
			// 			}
			// 		} catch {
			// 			// Do nothing
			// 		}
			//
			// 		setErrorState(response.statusText);
			// 		setLoadingRefereeContentApi(false);
			//
			// 		return;
			// 	}
			//
			// 	const json = (await response.json()) ;
			//
			// 	setRefereeContentApiResponse(json);
			// 	setLoadingRefereeContentApi(false);
			// } catch (error) {
			// 	consoleError("RefereeSearchContent", "Error calling referee search content API:", error);
			//
			// 	setErrorState(error?.message);
			// 	setLoadingRefereeContentApi(false);
			// }

};
