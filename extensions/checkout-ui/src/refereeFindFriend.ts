import { Environment } from "../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../shared/constants";
import { FoundReferrerState, NameSearchResult } from "./Checkout";

export interface RefereeFindFriendArgs {
	environment: Environment,
	mmPartnerCode: string,
	name?: string,
	email?: string,
	situation: string,
	setNameSearchResult: React.Dispatch<NameSearchResult>
	setFoundReferrerState: React.Dispatch<FoundReferrerState>
}

export const fetchRefereeFindFriend = async (args: RefereeFindFriendArgs) => {
	console.log("fetchRefereeFindFriend", args);

	const {
		environment,
		mmPartnerCode,
		name,
		email,
		situation,
		setNameSearchResult,
		setFoundReferrerState
	} = args;

	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
	} else if (environment === "local") {
		url = "mentionme.dev";
	}

	try {
		const response = await fetch(`https://${url}/api/consumer/v2/referrer/search?request[partnerCode]=${mmPartnerCode}&name=${name}&email=${email}&request[situation]=${situation}&request[appName]=${APP_NAME}&request[appVersion]=${APP_VERSION}`,
			{
				method: "GET",
				// mode: "no-cors",
				credentials: "include",
				headers: { accept: "application/json", "Content-Type": "application/json" },
			},
		);

		const json = await response.json();

		console.log("fetchRefereeFindFriend result", json);

		if (!response.ok) {
			console.error("Response not ok when calling referrerFindFriend:", response);

			if (response.status === 404) {
				if (json?.foundMultipleReferrers) {
					console.log("Multiple referrers found by name")
					// Can only occur if searching by name. Email search can't get a duplicate match.
					setNameSearchResult("duplicate-match");
					return;
				}

				console.log("Nothing found")
				setNameSearchResult("no-match");
				return;
			}

			setNameSearchResult("error");
			return;
		}

		if (response.ok && response.status === 200) {

			if (!json?.referrer?.referrerMentionMeIdentifier || !json?.referrer?.referrerToken) {
				throw new Error("Missing referrerMentionMeIdentifier or referrerToken in response");
			}

			setFoundReferrerState({
				referrerMentionMeIdentifier: json.referrer.referrerMentionMeIdentifier,
				referrerToken: json.referrer.referrerToken,
			});
			setNameSearchResult("single-match");

			return;
		}

		console.error("Unexpected response from API", json);
		setNameSearchResult("error");
		return;
	} catch (error) {
		console.error("Error caught calling referrerFindFriend:", error);
		setNameSearchResult("error");
	}
};
