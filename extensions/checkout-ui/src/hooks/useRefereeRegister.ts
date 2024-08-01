import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION, SHOPIFY_PREVIEW_MODE_FLAG } from "../../../../shared/constants";
import { SITUATION } from "../Checkout";
import { EnrolRefereeType } from "@api/consumer-api/src/types";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { RefereeRegister } from "@api/consumer-api/dist/types";
import { useExtensionEditor, useShop } from "@shopify/ui-extensions-react/checkout";
import { consoleError } from "../../../../shared/logging";

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

	const editor = useExtensionEditor();

	return useCallback(async (email: string) => {
		if (!partnerCode || typeof partnerCode !== "string") {
			consoleError("RefereeRegister", "Mention Me partner code not provided", partnerCode);
			return;
		}

		if (!isValidEnvironment(environment)) {
			consoleError("RefereeRegister", "Invalid environment", environment);
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
					appName: APP_NAME + (editor ? `/${SHOPIFY_PREVIEW_MODE_FLAG}` : ""),
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
				consoleError("RefereeRegister", "Response not ok when calling refereeRegister:", response);

				return;
			}

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

			consoleError("RefereeRegister", "Unexpected response from API", json);
			return;
		} catch (error) {
			consoleError("RefereeRegister", "Error caught calling registerReferee:", error);
		}
	}, [partnerCode, environment, setLoadingConsumerApi, nameSearchResult.result, myshopifyDomain, setRegisterResult, setStep, editor]);
};
