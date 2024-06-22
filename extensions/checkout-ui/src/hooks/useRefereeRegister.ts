import { isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { SITUATION } from "../Checkout";
import { EnrolRefereeType } from "@api/consumer-api/src/types";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { RefereeRegister } from "@api/consumer-api/dist/types";

export const useRefereeRegister = () => {
	const {
		mmPartnerCode,
		environment,
		setStep,
		setLoadingConsumerApi,
		nameSearchResult,
		setRegisterResult,
	} = useContext(RefereeJourneyContext);

	return useCallback(async (email: string) => {
		console.debug("useRefereeRegister");

		if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
			console.error("Mention Me partner code not provided", mmPartnerCode);
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		setLoadingConsumerApi(true);

		let url = "demo.mention-me.com";
		if (environment === "production") {
			url = "mention-me.com";
		} else if (environment === "local") {
			url = "mentionme.dev";
		}

		if (!nameSearchResult.result) {
			throw new Error("Expected nameSearchResult result to be defined");
		}

		try {
			const body: EnrolRefereeType = {
				request: {
					partnerCode: mmPartnerCode,
					situation: SITUATION,
					appName: APP_NAME,
					appVersion: APP_VERSION,
				},
				customer: {
					emailAddress: email,
				},
				referrerMentionMeIdentifier: nameSearchResult.result.referrerMentionMeIdentifier,
				referrerToken: nameSearchResult.result.referrerToken,
			};
			const response = await fetch(`https://${url}/api/consumer/v2/referee/register`,
				{
					method: "POST",
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
					body: JSON.stringify(body),
				},
			);

			const json = (await response.json()) as RefereeRegister;

			setLoadingConsumerApi(false);

			if (!response.ok) {
				console.error("Response not ok when calling refereeRegister:", response);

				return;
			}

			if (response.ok && response.status === 200) {
				setRegisterResult(json);
				setStep("register-result");
				console.log(json);
				return;
			}

			console.error("Unexpected response from API", json);
			return;
		} catch (error) {
			console.error("Error caught calling registerReferee:", error);
		}
	}, [environment, mmPartnerCode, nameSearchResult.result, setLoadingConsumerApi, setRegisterResult, setStep]);
};
