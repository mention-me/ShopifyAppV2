import { getDomainForEnvironment, isValidEnvironment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { useCallback, useContext, useMemo } from "react";
import { RefereeJourneyContext } from "../context/RefereeJourneyContext";
import { SITUATION } from "../Checkout";
import { ReferrerFound } from "@api/consumer-api/dist/types";

export const useRefereeFindFriend = () => {
	const {
		mmPartnerCode,
		environment,
		setLoadingConsumerApi,
		setNameSearchResult,
		search,
	} = useContext(RefereeJourneyContext);

	return useCallback(async () => {
		console.debug("fetchRefereeFindFriend");
		setLoadingConsumerApi(true);

		if (!mmPartnerCode || typeof mmPartnerCode !== "string") {
			return;
		}

		if (!isValidEnvironment(environment)) {
			console.error("Invalid Mention Me environment", environment);
			return;
		}

		const {name, email} = search;

		const url = getDomainForEnvironment(environment);

		try {
			const response = await fetch(`https://${url}/api/consumer/v2/referrer/search?request[partnerCode]=${mmPartnerCode}&name=${name}&email=${email}&request[situation]=${SITUATION}&request[appName]=${APP_NAME}&request[appVersion]=${APP_VERSION}`,
				{
					method: "GET",
					// mode: "no-cors",
					credentials: "include",
					headers: { accept: "application/json", "Content-Type": "application/json" },
				},
			);

			const json = (await response.json()) as ReferrerFound;

			console.log("fetchRefereeFindFriend result", json);

			if (!response.ok) {
				console.error("Response not ok when calling referrerFindFriend:", response);

				if (response.status === 404) {
					if (json?.foundMultipleReferrers) {
						console.log("Multiple referrers found by name");
						// Can only occur if searching by name. Email search can't get a duplicate match.
						setNameSearchResult({
							type: "duplicate-match",
						});
						return;
					}

					console.log("Nothing found");
					setNameSearchResult({
						type: "no-match",
					});
					return;
				}

				setNameSearchResult({
					type: "error",
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
						result: {
							referrerMentionMeIdentifier: json.referrer.referrerMentionMeIdentifier,
							referrerToken: json.referrer.referrerToken,
						},
					},
				);

				return;
			}

			console.error("Unexpected response from API", json);
			setNameSearchResult(
				{
					type: "error",
				},
			);
			return;
		} catch (error) {
			console.error("Error caught calling referrerFindFriend:", error);
			setNameSearchResult(
				{
					type: "error",
				},
			);
		}
	}, []);
};
