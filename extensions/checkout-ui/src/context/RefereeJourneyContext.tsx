import { createContext, Dispatch, ReactNode, SetStateAction, useMemo, useState } from "react";
import { useApplyDiscountCodeChange } from "@shopify/ui-extensions-react/checkout";
import { Environment } from "../../../../shared/utils";
import { RefereeEntryPointResponse } from "../hooks/useRefereeEntryPoint";

export type Step = "search-by-name" | "search-by-name-and-email" | "no-match" | "register" | "error";

export type NameSearchResultType = "loading" | "no-match" | "duplicate-match" | "single-match" | "error";

export interface RefereeSearch {
	name: string;
	email?: string;
}

export interface NameSearchResult {
	type: NameSearchResultType;
	result: any;
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
	applyDiscountChange: ReturnType<typeof useApplyDiscountCodeChange>;
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

	const applyDiscountChange = useApplyDiscountCodeChange();

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
			applyDiscountChange,
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
		applyDiscountChange,
	]);

	return (
		<RefereeJourneyContext.Provider value={state}>
			{children}
		</RefereeJourneyContext.Provider>
	);
};
