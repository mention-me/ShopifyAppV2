import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { useMentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";
import { EntryPointOfferAndLink } from "@api/entry-point-api/src/types";


type ReferrerJourneyState = {
	orderId: string;
	partnerCode: string;
	environment: Environment;
	defaultLocale: string;
	loadingMentionMeConfig,
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
	const {loading: loadingMentionMeConfig, mentionMeConfig} = useMentionMeShopifyConfig();

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
