import { SITUATION } from "../Checkout";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { chooseLocale, getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { EntryPointForRefereeType, EntryPointLink } from "@api/entry-point-api/src/types";
import { useContext, useEffect } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { useLanguage, useSettings, useShop } from "@shopify/ui-extensions-react/checkout";

export type RefereeEntryPointResponse = {
	error?: string;
	refereeEntryPointJson?: EntryPointLink;
}

/**
 * Function to call the Mention Me Referee EntryPoint API.
 *
 * This will return a CTA for this specific locale, which will be something similar to "Been referred by a friend?".
 *
 * It will also return a URL, but we will ignore this as we will use the Consumer API to build our own fully fledged UI
 * using Shopify components.
 */
export const useRefereeEntryPoint = () => {
	const {
		mmPartnerCode,
		environment,
		setLoadingEntryPointApi,
		setRefereeEntryPointResponse,
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	const {isoCode: language} = useLanguage();

	const { fallbackLocale } = useSettings();

	const locale = chooseLocale(language, fallbackLocale);

	useEffect(() => {
		const fetchRefereeEntryPoint = async () => {
			console.debug("fetchRefereeEntryPoint");
			setLoadingEntryPointApi(true);

			const body: EntryPointForRefereeType = {
				request: {
					partnerCode: mmPartnerCode,
					situation: SITUATION,
					appVersion: `${myshopifyDomain}/${APP_VERSION}`,
					appName: APP_NAME,
					localeCode: locale,
				},
				implementation: {
					wrapContentWithBranding: true,
					showCloseIcon: false,
				},
			};

			if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
				return;
			}

			if (!isValidEnvironment(environment)) {
				console.error("Invalid Mention Me environment", environment);
				return;
			}

			const url = getDomainForEnvironment(environment);

			try {
				const response = await fetch(`https://${url}/api/entry-point/v2/referee`,
					{
						method: "POST",
						credentials: "include",
						headers: { accept: "application/json", "Content-Type": "application/json" },
						body: JSON.stringify(body),
					},
				);

				if (!response.ok) {
					console.error("Error calling entrypoint:", response);

					setRefereeEntryPointResponse({
						error: response.statusText,
						refereeEntryPointJson: null,
					});
					setLoadingEntryPointApi(false);
				}

				const json = await response.json();

				setRefereeEntryPointResponse({
					error: null,
					refereeEntryPointJson: json,
				});
				setLoadingEntryPointApi(false);
			} catch (error) {
				console.error("Error calling entrypoint:", error);

				setRefereeEntryPointResponse({
					error: error.message,
					refereeEntryPointJson: null,
				});
				setLoadingEntryPointApi(false);
			}
		};

		if (mmPartnerCode && environment) {
			fetchRefereeEntryPoint();
		}
	}, [mmPartnerCode, environment, setLoadingEntryPointApi, myshopifyDomain, setRefereeEntryPointResponse]);
};
