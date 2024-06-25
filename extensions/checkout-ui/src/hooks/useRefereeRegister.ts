import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { SITUATION } from "../Checkout";
import { EnrolRefereeType } from "@api/consumer-api/src/types";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { RefereeRegister } from "@api/consumer-api/dist/types";
import { useShop } from "@shopify/ui-extensions-react/checkout";

export const useRefereeRegister = () => {
	const {
		partnerCode,
		environment,
		setStep,
		setLoadingConsumerApi,
		nameSearchResult,
		setRegisterResult,
	} = useContext(RefereeJourneyContext);

	const { myshopifyDomain } = useShop();

	return useCallback(async (email: string) => {
		console.debug("useRefereeRegister");

		if (!partnerCode || typeof partnerCode !== "string") {
			console.error("Mention Me partner code not provided", partnerCode);
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		setLoadingConsumerApi(true);

		const url = getDomainForEnvironment(environment);

		if (!nameSearchResult.result) {
			throw new Error("Expected nameSearchResult result to be defined");
		}

		try {
			const body: EnrolRefereeType = {
				request: {
					partnerCode: partnerCode,
					situation: SITUATION,
					appName: APP_NAME,
					appVersion: `${myshopifyDomain}/${APP_VERSION}`,
				},
				customer: {
					emailAddress: email,
				},
				referrerMentionMeIdentifier: nameSearchResult.result.referrer.referrerMentionMeIdentifier,
				referrerToken: nameSearchResult.result.referrer.referrerToken,
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

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const content = json.content.resource.reduce((acc, curr) => {
				acc[curr.key] = curr.content;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return acc;
			}, {});

			if (response.ok && response.status === 200) {
				setRegisterResult(
					{
						result: json,
						content,
					},
				);
				setStep("register-result");
				return;
			}

			console.error("Unexpected response from API", json);
			return;
		} catch (error) {
			console.error("Error caught calling registerReferee:", error);
		}
	}, [partnerCode, environment, setLoadingConsumerApi, nameSearchResult.result, myshopifyDomain, setRegisterResult, setStep]);
};
