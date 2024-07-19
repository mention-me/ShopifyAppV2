import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { EntryPointOfferAndLink } from "@api/entry-point-api/src/types";
import { MentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";


type ReferrerJourneyState = {
	orderId: string;
	partnerCode: string;
	environment: Environment;
	defaultLocale: string;
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
	readonly mentionMeConfig: MentionMeShopifyConfig;
	readonly children: ReactNode;
}

export const ReferrerJourneyProvider = ({ orderId, mentionMeConfig, children }: Props) => {
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
