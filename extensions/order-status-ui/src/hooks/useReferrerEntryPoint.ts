import { useContext, useEffect } from "react";
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment, parseShopifyOrderId } from "../../../../shared/utils";
import {
	useBillingAddress,
	useEmail,
	useExtensionEditor,
	useLanguage,
	useShop,
	useTotalAmount,
} from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { ReferrerJourneyContext } from "../context/ReferrerJourneyContext";

const useReferrerEntryPoint = () => {
	const {myshopifyDomain} = useShop();

	const {
		orderId,
		partnerCode,
		environment,
		defaultLocale,
		setLoadingEntryPointApi,
		setReferrerEntryPointResponse,
		setErrorState,
	} = useContext(ReferrerJourneyContext);

	const editor = useExtensionEditor();

	const language = useLanguage();

	const locale = useLocale({ shopifyLanguage: language.isoCode, defaultLocale });

	const email = useEmail();
	const money = useTotalAmount();
	const billingAddress = useBillingAddress();

	useEffect(() => {
		const fetchReferrerEntryPoint = async () => {
			setLoadingEntryPointApi(true);

			const body: EntryPointForReferrerType = {
				customer: {
					emailAddress: email,
					firstname: billingAddress?.firstName,
					surname: billingAddress?.lastName,
				},
				request: {
					partnerCode: partnerCode,
					situation: "shopify-order-status",
					appVersion: `${myshopifyDomain}/${APP_VERSION}`,
					appName: APP_NAME,
					localeCode: locale,
				},
				implementation: {
					wrapContentWithBranding: true,
					showCloseIcon: false,
				},
				order: {
					orderIdentifier: parseShopifyOrderId(orderId),
					currencyCode: money.currencyCode,
					// When we're in the editor, don't record a value. This is to prevent these values being counted
					// as real orders.
					total: editor ? "0" : String(money.amount),
					// Use the time of the request instead of explicitly setting a time.
					dateString: "",
				},
			};

			if (!partnerCode || typeof partnerCode !== "string") {
				console.error("Mention Me partner code not provided", partnerCode);
				return;
			}

			if (!isValidEnvironment(environment)) {
				console.error("Invalid Mention Me environment", environment);
				return;
			}

			const url = getDomainForEnvironment(environment);

			try {
				const response = await fetch(`https://${url}/api/entry-point/v2/offer`,
					{
						method: "POST",
						credentials: "include",
						headers: { accept: "application/json", "Content-Type": "application/json" },
						body: JSON.stringify(body),
					},
				);

				if (!response.ok) {
					console.error("Error calling entrypoint:", response);

					console.log(await response.json());
					setErrorState(response.statusText);
					setLoadingEntryPointApi(false);

					return;
				}

				const json = (await response.json()) as EntryPointOfferAndLink;

				setReferrerEntryPointResponse(json);
				setLoadingEntryPointApi(false);
			} catch (error) {
				console.error("Error calling referrer entrypoint:", error);

				setErrorState(error?.message);
				setLoadingEntryPointApi(false);
			}
		};

		if (partnerCode && environment) {
			fetchReferrerEntryPoint();
		}
	}, [partnerCode, environment, setLoadingEntryPointApi, myshopifyDomain, locale, setErrorState, email, billingAddress?.firstName, billingAddress?.lastName, orderId, money.currencyCode, money.amount, setReferrerEntryPointResponse, editor]);
};

export default useReferrerEntryPoint;
