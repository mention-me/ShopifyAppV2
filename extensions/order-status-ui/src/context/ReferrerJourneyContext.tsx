import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { useMentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";
import { EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import {
	useCurrency,
	useExtensionLanguage,
	useLanguage,
	useLocalizationCountry,
	useLocalizationMarket,
	useShop,
} from "@shopify/ui-extensions-react/checkout";


type ReferrerJourneyState = {
	orderId: string;
	partnerCode: string;
	environment: Environment;
	defaultLocale: string;
	loadingMentionMeConfig: boolean;
	loadingEntryPointApi: boolean;
	setLoadingEntryPointApi: Dispatch<SetStateAction<boolean>>;
	referrerEntryPointResponse: EntryPointOfferAndLink;
	setReferrerEntryPointResponse: Dispatch<SetStateAction<EntryPointOfferAndLink>>;
	errorState: string;
	setErrorState: Dispatch<SetStateAction<string>>;
}

export const ReferrerJourneyContext = createContext<ReferrerJourneyState>(undefined);

interface Props {
	readonly orderId: string;
	readonly children: ReactNode;
}

export const ReferrerJourneyProvider = ({ orderId, children }: Props) => {
	const { myshopifyDomain } = useShop();

	const currency = useCurrency();
	const extensionLanguage = useExtensionLanguage();
	const language = useLanguage();
	const country = useLocalizationCountry();
	const market = useLocalizationMarket();

	const { loading: loadingMentionMeConfig, mentionMeConfig } = useMentionMeShopifyConfig({
			myshopifyDomain,
			extension: "order-status",
			extensionLanguage: extensionLanguage.isoCode,
			language: language.isoCode,
			country: country?.isoCode,
			currency: currency.isoCode,
			marketId: market?.id,
			marketHandle: market?.handle,
		},
	);

	const [loadingEntryPointApi, setLoadingEntryPointApi] = useState(true);

	const [referrerEntryPointResponse, setReferrerEntryPointResponse] = useState<EntryPointOfferAndLink>();

	const [errorState, setErrorState] = useState<string>();

	const state = useMemo(() => {
		const { partnerCode, environment, defaultLocale } = mentionMeConfig;

		return {
			orderId,
			partnerCode,
			environment,
			defaultLocale,
			loadingMentionMeConfig,
			loadingEntryPointApi,
			setLoadingEntryPointApi,
			referrerEntryPointResponse,
			setReferrerEntryPointResponse,
			errorState,
			setErrorState,
		};
	}, [
		orderId,
		mentionMeConfig,
		loadingMentionMeConfig,
		loadingEntryPointApi,
		referrerEntryPointResponse,
		errorState,
	]);

	return (
		<ReferrerJourneyContext.Provider value={state}>
			{children}
		</ReferrerJourneyContext.Provider>
	);
};
