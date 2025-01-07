import { useContext, useEffect } from "react";
import { EntryPointForReferrerType, EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { getDomainForEnvironment, isValidEnvironment, parseShopifyId } from "../../../../shared/utils";
import {
	useBillingAddress,
	useCustomer,
	useDiscountAllocations,
	useDiscountCodes,
	useEmail,
	useExtensionEditor,
	useLanguage,
	useLocalizationCountry,
	useShop,
	useTotalAmount,
} from "@shopify/ui-extensions-react/checkout";
import useLocale from "../../../../shared/hooks/useLocale";
import { ReferrerJourneyContext } from "../context/ReferrerJourneyContext";
import { consoleError } from "../../../../shared/logging";
import { ExtensionType } from "../Extension";
import { logError } from "../../../../shared/sentry";

const useReferrerEntryPoint = (extensionType: ExtensionType) => {
	const { myshopifyDomain } = useShop();

	const {
		orderId,
		partnerCode,
		environment,
		defaultLocale,
		localeChoiceMethod,
		setLoadingEntryPointApi,
		setReferrerEntryPointResponse,
		setErrorState,
	} = useContext(ReferrerJourneyContext);

	const editor = useExtensionEditor();

	const { isoCode: languageOrLocale } = useLanguage();
	const country = useLocalizationCountry();

	const locale = useLocale(languageOrLocale, country?.isoCode, defaultLocale, localeChoiceMethod);

	const email = useEmail();
	const customer = useCustomer();

	const money = useTotalAmount();
	const billingAddress = useBillingAddress();

	const discountCodes = useDiscountCodes();
	const discountAllocations = useDiscountAllocations();

	useEffect(() => {
		// The Mention Me API supports multiple discount codes, comma separated.
		const codes = discountCodes.map((discountCode) => {
			return discountCode.code;
		}).join(",");

		const discountAmount = discountAllocations.reduce((total, currentValue) => {
			return total + currentValue.discountedAmount.amount;
		}, 0);

		const customField = [myshopifyDomain];

		const fetchReferrerEntryPoint = async () => {
			setLoadingEntryPointApi(true);

			const body: EntryPointForReferrerType = {
				customer: {
					emailAddress: email,
					firstname: billingAddress?.firstName,
					surname: billingAddress?.lastName,
					uniqueIdentifier: customer ? parseShopifyId(customer.id) : undefined,
					customField: customField.join("|"),
				},
				request: {
					partnerCode: partnerCode,
					situation: `shopify-${extensionType}`,
					appName: APP_NAME + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
					appVersion: `${myshopifyDomain}/${APP_VERSION}`,
					localeCode: locale,
				},
				implementation: {
					wrapContentWithBranding: true,
					showCloseIcon: false,
				},
				address: {
					addressLine1: billingAddress?.address1,
					addressLine2: billingAddress?.address2,
					addressCity: billingAddress?.city,
					addressCounty: billingAddress?.provinceCode,
					addressPostCode: billingAddress?.zip,
					addressCountry: billingAddress?.countryCode,
				},
				order: {
					orderIdentifier: parseShopifyId(orderId),
					currencyCode: money?.currencyCode,
					// When we're in the editor, don't record a value. This is to prevent these values being counted
					// as real orders.
					total: editor ? "0" : String(money?.amount),
					// Use the time of the request instead of explicitly setting a time.
					dateString: "",
					couponCode: codes,
					discountAmount: String(discountAmount),
				},
			};

			if (!partnerCode || typeof partnerCode !== "string") {
				consoleError("ReferrerEntryPoint", "Mention Me partner code not provided", partnerCode);
				return;
			}

			if (!isValidEnvironment(environment)) {
				consoleError("ReferrerEntryPoint", "Invalid Mention Me environment", environment);
				return;
			}

			const url = getDomainForEnvironment(myshopifyDomain, environment);

			const response = await fetch(`https://${url}/api/entry-point/v2/offer`,
				{
					method: "POST",
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
					body: JSON.stringify(body),
				},
			);

			if (!response.ok) {
				const message = `Error calling Referrer EntryPoint. Response: ${response.status}, ${response.statusText}`;
				logError("ReferrerEntryPoint", message, new Error(message));

				setErrorState(true);
				setLoadingEntryPointApi(false);

				return;
			}

			const json = (await response.json()) as EntryPointOfferAndLink;

			setReferrerEntryPointResponse(json);
			setLoadingEntryPointApi(false);
		};

		// There's a behaviour in the Shopify API where "money" is undefined until the order is fully loaded.
		// See: https://github.com/Shopify/ui-extensions/issues/2203
		if (partnerCode && environment && locale && (money?.amount || money?.amount === 0) && money?.currencyCode) {
			fetchReferrerEntryPoint();
		}
	}, [
		partnerCode,
		environment,
		setLoadingEntryPointApi,
		myshopifyDomain,
		locale,
		setErrorState,
		email,
		billingAddress?.firstName,
		billingAddress?.lastName,
		billingAddress?.zip,
		orderId,
		money,
		setReferrerEntryPointResponse,
		editor,
		discountCodes,
		discountAllocations,
		extensionType,
		customer
	]);
};

export default useReferrerEntryPoint;
