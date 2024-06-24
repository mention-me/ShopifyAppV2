import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { useCallback, useContext } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { SITUATION } from "../Checkout";
import { ReferrerFound } from "@api/consumer-api/dist/types";

export const useRefereeFindFriend = () => {
	const {
		mmPartnerCode,
		environment,
		setLoadingConsumerApi,
		setNameSearchResult,
		setStep,
		search,
	} = useContext(RefereeJourneyContext);

	return useCallback(async () => {
		console.debug("fetchRefereeFindFriend");
		setLoadingConsumerApi(true);

		if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
			console.error("Mention Me partner code not provided", mmPartnerCode);
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		const { name, email } = search;

		const url = getDomainForEnvironment(environment);

		const params = new URLSearchParams({
			"request[partnerCode]": mmPartnerCode,
			"request[situation]": SITUATION,
			"request[appName]": APP_NAME,
			"request[appVersion]": APP_VERSION,
		});

		if (name) {
			params.set("name", name);
		}

		if (email) {
			params.set("email", email);
		}

		try {
			const response = await fetch(`https://${url}/api/consumer/v2/referrer/search?${params.toString()}`,
				{
					method: "GET",
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
				},
			);

			const json = (await response.json()) as ReferrerFound;

			setLoadingConsumerApi(false);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const content = json.links[0].resource.reduce((acc, curr) => {
				acc[curr.key] = curr.content;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return acc;
			}, {});

			if (!response.ok) {
				console.error("Response not ok when calling referrerFindFriend:", response);

				if (response.status === 404) {
					if (json?.foundMultipleReferrers) {
						// Can only occur if searching by name. Email search can't get a duplicate match.
						setNameSearchResult({
							type: "duplicate-match",
							result: json,
							content
						});
						return;
					}

					setNameSearchResult({
						type: "no-match",
						result: json,
						content
					});
					return;
				}

				setNameSearchResult({
					type: "error",
					result: json,
					content
				});
				return;
			}

			if (response.ok && response.status === 200) {
				if (!json?.referrer?.referrerMentionMeIdentifier || !json?.referrer?.referrerToken) {
					throw new Error("Missing referrerMentionMeIdentifier or referrerToken in response");
				}

				setNameSearchResult(
					{
						type: "single-match",
						result: json,
						content
					},
				);

				setStep("register");

				return;
			}

			console.error("Unexpected response from API", json);
			setNameSearchResult(
				{
					type: "error",
					result: json,
					content
				},
			);
			return;
		} catch (error) {
			console.error("Error caught calling referrerFindFriend:", error);
			setNameSearchResult({
				type: "error",
			});
		}
	}, [environment, mmPartnerCode, search, setLoadingConsumerApi, setNameSearchResult, setStep]);
};
