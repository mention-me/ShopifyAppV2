import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { RefereeRegister, ReferrerFound } from "@api/consumer-api/dist/types";
import { MentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";
import { EntryPointLink } from "@api/entry-point-api/src/types";
import { RefereeContent } from "@api/consumer-api/src/types";

export type Step =
	"search-by-name"
	| "no-match"
	| "no-match-final"
	| "duplicate-match"
	| "register"
	| "register-result"
	| "completed-success";

export type NameSearchResultType = "no-match" | "no-match-final" | "duplicate-match" | "single-match" | "error";

export interface RefereeSearch {
	name: string;
	email?: string;
}

export interface NameSearchResult {
	type: NameSearchResultType;
	result?: ReferrerFound;
	content?: { [key: string]: string };
}

export interface RegisterResult {
	result?: RefereeRegister;
	content?: { [key: string]: string };
}

type RefereeJourneyState = {
	partnerCode?: string;
	environment?: Environment;
	defaultLocale?: string;
	localeChoiceMethod?: string;
	step: Step;
	setStep: Dispatch<SetStateAction<Step>>;
	mentionMeConfig: MentionMeShopifyConfig;
	loadingRefereeContentApi: boolean;
	setLoadingRefereeContentApi: Dispatch<SetStateAction<boolean>>;
	loadingConsumerApi: boolean;
	setLoadingConsumerApi: Dispatch<SetStateAction<boolean>>;
	refereeContentApiResponse: RefereeContent;
	setRefereeContentApiResponse: Dispatch<SetStateAction<RefereeContent>>;
	search: RefereeSearch;
	setSearch: Dispatch<SetStateAction<RefereeSearch>>;
	nameSearchResult: NameSearchResult;
	setNameSearchResult: Dispatch<SetStateAction<NameSearchResult>>;
	registerResult: RegisterResult;
	setRegisterResult: Dispatch<SetStateAction<RegisterResult>>;
	errorState: string;
	setErrorState: Dispatch<SetStateAction<string>>;
}

export const RefereeJourneyContext = createContext<RefereeJourneyState | null>(null);

interface Props {
	readonly children: ReactNode;
	readonly mentionMeConfig: MentionMeShopifyConfig;
}

export const RefereeJourneyProvider = ({ mentionMeConfig, children }: Props) => {
	const [step, setStep] = useState<RefereeJourneyState["step"]>("search-by-name");
	const [loadingRefereeContentApi, setLoadingRefereeContentApi] = useState(true);
	const [loadingConsumerApi, setLoadingConsumerApi] = useState(false);

	const [refereeContentApiResponse, setRefereeContentApiResponse] = useState<EntryPointLink>();

	const [search, setSearch] = useState<RefereeSearch>();
	const [nameSearchResult, setNameSearchResult] = useState<NameSearchResult>();

	const [registerResult, setRegisterResult] = useState<RefereeRegister>();

	const [errorState, setErrorState] = useState<string>();

	const state = useMemo(() => {
		const { partnerCode, environment, defaultLocale, localeChoiceMethod } = mentionMeConfig;

		return {
			partnerCode,
			environment,
			defaultLocale,
			localeChoiceMethod,
			step,
			setStep,
			mentionMeConfig,
			loadingRefereeContentApi,
			setLoadingRefereeContentApi,
			loadingConsumerApi,
			setLoadingConsumerApi,
			refereeContentApiResponse,
			setRefereeContentApiResponse,
			search,
			setSearch,
			nameSearchResult,
			setNameSearchResult,
			registerResult,
			setRegisterResult,
			errorState,
			setErrorState,
		};
	}, [
		mentionMeConfig,
		step,
		loadingRefereeContentApi,
		loadingConsumerApi,
		refereeContentApiResponse,
		search,
		nameSearchResult,
		registerResult,
		errorState,
	]);

	return (
		<RefereeJourneyContext.Provider value={state}>
			{children}
		</RefereeJourneyContext.Provider>
	);
};
