import { SITUATION } from "../Checkout";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { RefereeContent } from "@api/consumer-api/src/types";
import { useContext, useEffect } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { useExtensionEditor, useShop } from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { useLanguage } from "@shopify/ui-extensions-react/checkout";
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
		setLoadingRefereeContentApi,
		setRefereeContentApiResponse,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	const editor = useExtensionEditor();

	const { isoCode } = useLanguage();

	const locale = useLocale({shopifyLanguage: isoCode, defaultLocale});

	useEffect(() => {
		const fetchRefereeJourneyContent = async () => {
			setLoadingRefereeContentApi(true);

			if (!partnerCode || typeof partnerCode !== "string") {
				return;
			}

			if (!isValidEnvironment(environment)) {
				return;
			}

			if (!locale) {
				return;
			}

			const url = getDomainForEnvironment(environment);

			const params = new URLSearchParams({
				"request[partnerCode]": partnerCode,
				"request[situation]": SITUATION,
				"request[appName]": APP_NAME  + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
				"request[appVersion]": `${myshopifyDomain}/${APP_VERSION}`,
				"request[localeCode]": locale,
			});

			try {
				const response = await fetch(`https://${url}/api/consumer/v2/referrer/search/content?${params.toString()}`,
					{
						method: "GET",
						credentials: "include",
						headers: { accept: "application/json", "Content-Type": "application/json" },
					},
				);

				if (!response.ok) {
					const message = `Error calling Referee SearchContent API. Response: ${response.status}, ${response.statusText}`;
					logError("ReferrerEntryPoint", message, new Error(message));

					try {
						const json = (await response.json()) as RefereeContent;

						if (json.errors) {
							consoleError("RefereeSearchContent", "Errors returned from Mention Me API:", json.errors.map((error) => error.message).join(", "));
						}
					} catch {
						// Do nothing
					}

					setErrorState(response.statusText);
					setLoadingRefereeContentApi(false);

					return;
				}

				const json = (await response.json()) as RefereeContent;

				setRefereeContentApiResponse(json);
				setLoadingRefereeContentApi(false);
			} catch (error) {
				consoleError("RefereeSearchContent", "Error calling referee search content API:", error);

				setErrorState(error?.message);
				setLoadingRefereeContentApi(false);
			}
		};

		if (partnerCode && environment && locale) {
			fetchRefereeJourneyContent();
		}
	}, [partnerCode, environment, setLoadingRefereeContentApi, myshopifyDomain, setRefereeContentApiResponse, locale, setErrorState, editor]);
};
