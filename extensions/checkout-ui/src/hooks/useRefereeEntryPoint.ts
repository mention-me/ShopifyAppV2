import { SITUATION } from "../Checkout";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { EntryPointForRefereeType, EntryPointLink } from "@api/entry-point-api/src/types";
import { useContext, useEffect } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { useShop } from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";

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
		partnerCode,
		environment,
		setLoadingEntryPointApi,
		setRefereeEntryPointResponse,
		setErrorState,
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	const locale = useLocale();

	useEffect(() => {
		const fetchRefereeEntryPoint = async () => {
			setLoadingEntryPointApi(true);

			const body: EntryPointForRefereeType = {
				request: {
					partnerCode: partnerCode,
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

			if (!partnerCode || typeof partnerCode !== "string") {
				// console.error("Mention Me partner code not provided", partnerCode);
				return;
			}

			if (!isValidEnvironment(environment)) {
				// console.error("Invalid Mention Me environment", environment);
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

					setErrorState(response.statusText);
					setLoadingEntryPointApi(false);

					return;
				}

				const json = (await response.json()) as EntryPointLink;

				setRefereeEntryPointResponse(json);
				setLoadingEntryPointApi(false);
			} catch (error) {
				console.error("Error calling referee entrypoint:", error);

				setErrorState(error?.message);
				setLoadingEntryPointApi(false);
			}
		};

		if (partnerCode && environment && locale) {
			fetchRefereeEntryPoint();
		}
	}, [partnerCode, environment, setLoadingEntryPointApi, myshopifyDomain, setRefereeEntryPointResponse, locale, setErrorState]);
};
