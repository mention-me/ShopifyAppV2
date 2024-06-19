import { Environment } from "../../../../shared/utils";
import { APP_NAME, APP_VERSION } from "../../../../shared/constants";
import { FoundReferrerState, SITUATION } from "../Checkout";
import { EnrolRefereeType } from "@api/mention-me/src/types";

export interface RefereeRegisterFriendArgs {
	environment: Environment,
	mmPartnerCode: string,
	email: string,
	situation: string,
	foundReferrerState: FoundReferrerState
	setRefereeRegisterResult: React.Dispatch<any>;
}

export const useRefereeRegister = async (args: RefereeRegisterFriendArgs) => {
	console.log("registerReferee", args);

	const {
		environment,
		mmPartnerCode,
		email,
		foundReferrerState,
		setRefereeRegisterResult
	} = args;

	let url = "demo.mention-me.com";
	if (environment === "production") {
		url = "mention-me.com";
	} else if (environment === "local") {
		url = "mentionme.dev";
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
			referrerMentionMeIdentifier: foundReferrerState.referrerMentionMeIdentifier,
			referrerToken: foundReferrerState.referrerToken,
		};
		const response = await fetch(`https://${url}/api/consumer/v2/referee/register`,
			{
				method: "POST",
				// mode: "no-cors",
				credentials: "include",
				headers: { accept: "application/json", "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
		);

		const json = await response.json();

		if (!response.ok) {
			console.error("Response not ok when calling referrerFindFriend:", response);

			return;
		}

		if (response.ok && response.status === 200) {
			setRefereeRegisterResult(json);
			return;
		}

		console.error("Unexpected response from API", json);
		return;
	} catch (error) {
		console.error("Error caught calling registerReferee:", error);
	}
};
