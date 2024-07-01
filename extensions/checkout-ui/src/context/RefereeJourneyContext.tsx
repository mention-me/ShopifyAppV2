import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { RefereeRegister, ReferrerFound } from "@api/consumer-api/dist/types";
import { useMentionMeShopifyConfig } from "../../../../shared/hooks/useMentionMeShopifyConfig";
import { EntryPointLink } from "@api/entry-point-api/src/types";

export type Step =
	"search-by-name"
	| "no-match"
	| "register"
	| "register-result"
	| "completed-success";

export type NameSearchResultType = "no-match" | "duplicate-match" | "single-match" | "error";

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
	step: Step;
	setStep: Dispatch<SetStateAction<Step>>;
	loadingMentionMeConfig: boolean;
	loadingEntryPointApi: boolean;
	setLoadingEntryPointApi: Dispatch<SetStateAction<boolean>>;
	loadingConsumerApi: boolean;
	setLoadingConsumerApi: Dispatch<SetStateAction<boolean>>;
	refereeEntryPointResponse: EntryPointLink;
	setRefereeEntryPointResponse: Dispatch<SetStateAction<EntryPointLink>>;
	search: RefereeSearch;
	setSearch: Dispatch<SetStateAction<RefereeSearch>>;
	nameSearchResult: NameSearchResult;
	setNameSearchResult: Dispatch<SetStateAction<NameSearchResult>>;
	registerResult: RegisterResult;
	setRegisterResult: Dispatch<SetStateAction<RegisterResult>>;
	errorState: string;
	setErrorState: Dispatch<SetStateAction<string>>;
	/**
	 * We should control the state of the modal using Shopify's built-in components, but they don't provide a way
	 * to programmatically close the modal.
	 *
	 * https://github.com/Shopify/ui-extensions/issues/1009
	 */
	modalVisible: boolean;
	setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export const RefereeJourneyContext = createContext<RefereeJourneyState | null>(null);

interface Props {
	readonly children: ReactNode;
}

export const RefereeJourneyProvider = ({ children }: Props) => {
	const {loading: loadingMentionMeConfig, mentionMeConfig} = useMentionMeShopifyConfig();

	const [step, setStep] = useState<RefereeJourneyState["step"]>("search-by-name");
	const [loadingEntryPointApi, setLoadingEntryPointApi] = useState(true);
	const [loadingConsumerApi, setLoadingConsumerApi] = useState(false);

	const [refereeEntryPointResponse, setRefereeEntryPointResponse] = useState<EntryPointLink>();

	const [search, setSearch] = useState<RefereeSearch>();
	const [nameSearchResult, setNameSearchResult] = useState<NameSearchResult>();

	const [registerResult, setRegisterResult] = useState<RefereeRegister>();

	const [errorState, setErrorState] = useState<string>();

	const [modalVisible, setModalVisible] = useState(false);

	const state = useMemo(() => {
		const { partnerCode, environment, defaultLocale } = mentionMeConfig;

		return {
			partnerCode,
			environment,
			defaultLocale,
			step,
			setStep,
			loadingMentionMeConfig,
			loadingEntryPointApi,
			setLoadingEntryPointApi,
			loadingConsumerApi,
			setLoadingConsumerApi,
			refereeEntryPointResponse,
			setRefereeEntryPointResponse,
			search,
			setSearch,
			nameSearchResult,
			setNameSearchResult,
			registerResult,
			setRegisterResult,
			errorState,
			setErrorState,
			modalVisible,
			setModalVisible
		};
	}, [
		mentionMeConfig,
		step,
		loadingMentionMeConfig,
		loadingEntryPointApi,
		loadingConsumerApi,
		refereeEntryPointResponse,
		search,
		nameSearchResult,
		registerResult,
		errorState,
		modalVisible
	]);

	return (
		<RefereeJourneyContext.Provider value={state}>
			{children}
		</RefereeJourneyContext.Provider>
	);
};
