import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { Environment } from "../../../../shared/utils";
import { RefereeEntryPointResponse } from "../hooks/useRefereeEntryPoint";
import { RefereeRegister, ReferrerFound } from "@api/consumer-api/dist/types";

export type Step = "search-by-name" | "search-by-name-and-email" | "no-match" | "register" | "register-result" | "completed-success";

export type NameSearchResultType = "loading" | "no-match" | "duplicate-match" | "single-match" | "error";

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
	mmPartnerCode: string;
	environment: Environment;
	step: Step;
	setStep: Dispatch<SetStateAction<Step>>;
	loadingEntryPointApi: boolean;
	setLoadingEntryPointApi: Dispatch<SetStateAction<boolean>>;
	loadingConsumerApi: boolean;
	setLoadingConsumerApi: Dispatch<SetStateAction<boolean>>;
	refereeEntryPointResponse: RefereeEntryPointResponse;
	setRefereeEntryPointResponse: Dispatch<SetStateAction<RefereeEntryPointResponse>>;
	search: RefereeSearch;
	setSearch: Dispatch<SetStateAction<RefereeSearch>>;
	nameSearchResult: NameSearchResult;
	setNameSearchResult: Dispatch<SetStateAction<NameSearchResult>>;
	registerResult: RegisterResult;
	setRegisterResult: Dispatch<SetStateAction<RegisterResult>>;
	errorState: string;
	setErrorState: Dispatch<SetStateAction<string>>;
}

export const RefereeJourneyContext = createContext<RefereeJourneyState>(undefined);

interface Props {
	readonly mmPartnerCode: string;
	readonly environment: Environment;
	readonly children: ReactNode;
}

export const RefereeJourneyProvider = ({ mmPartnerCode, environment, children }: Props) => {
	const [step, setStep] = useState<RefereeJourneyState["step"]>("search-by-name");
	const [loadingEntryPointApi, setLoadingEntryPointApi] = useState(true);
	const [loadingConsumerApi, setLoadingConsumerApi] = useState(false);

	const [refereeEntryPointResponse, setRefereeEntryPointResponse] = useState<RefereeEntryPointResponse>();

	const [search, setSearch] = useState<RefereeSearch>();
	const [nameSearchResult, setNameSearchResult] = useState<NameSearchResult>();

	const [registerResult, setRegisterResult] = useState<RefereeRegister>();

	const [errorState, setErrorState] = useState<string>();

	const state = useMemo(() => {
		return {
			mmPartnerCode,
			environment,
			step,
			setStep,
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
		};
	}, [
		mmPartnerCode,
		environment,
		step,
		loadingEntryPointApi,
		loadingConsumerApi,
		refereeEntryPointResponse,
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
